// Shiori security probe: behaves like an outsider against a running server and reports what gets through.
// Usage: SHIORI_PASSWORD=<password> node scripts/security-probe.mjs [http://127.0.0.1:43000]
// Every check prints PASS/FAIL; the exit code is the number of failures.
import { createHash } from "node:crypto"

const BASE = process.argv[2] || "http://127.0.0.1:43000"
const PASSWORD = process.env.SHIORI_PASSWORD
if (!PASSWORD) {
    console.error("Set SHIORI_PASSWORD to the server password.")
    process.exit(2)
}
const TOKEN = createHash("sha256").update(PASSWORD).digest("hex")
let failures = 0

function check(name, ok, detail = "") {
    if (!ok) failures++
    console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`)
}
const get = (path, headers = {}) => fetch(BASE + path, { headers, redirect: "manual" })

// 1. Without the password the server only admits that it exists.
{
    const r = await get("/api/v1/status")
    const b = await r.json()
    check("status without password is restricted", r.status === 200 && !b?.data?.version && b?.data?.serverHasPassword === true)
}
for (const path of ["/api/v1/settings", "/api/v1/library/collection", "/api/v1/extensions/list", "/api/v1/torrent-client/list", "/api/v1/directory-selector"]) {
    const r = await get(path)
    check(`${path} refuses without password`, r.status === 401 || r.status === 405, `HTTP ${r.status}`)
}

// 2. The right password works and sets the HttpOnly media cookie.
let cookie = ""
{
    const r = await get("/api/v1/status", { "X-Seanime-Token": TOKEN })
    const b = await r.json()
    const set = r.headers.getSetCookie().find(c => c.startsWith("shiori_auth=")) || ""
    cookie = (set.match(/shiori_auth=[^;]+/) || [""])[0]
    check("correct password unlocks status", !!b?.data?.version)
    check("login cookie is HttpOnly + SameSite=Strict", /HttpOnly/i.test(set) && /SameSite=Strict/i.test(set), set.replace(/=[0-9a-f]{64}/, "=<hash>"))
}

// 3. Media folders outside /api need the password too.
for (const path of ["/manga-downloads/probe/1.jpg", "/offline-assets/probe.jpg", "/assets/probe.png"]) {
    const anon = await get(path)
    const authed = await get(path, { Cookie: cookie })
    check(`${path} blocked without password`, anon.status === 401, `HTTP ${anon.status}`)
    check(`${path} passes auth with cookie`, authed.status !== 401 && authed.status !== 429, `HTTP ${authed.status}`)
}

// 4. Browser hardening headers on the app page.
{
    const r = await get("/")
    const csp = r.headers.get("content-security-policy") || ""
    check("CSP forbids inline and foreign scripts", csp.includes("script-src 'self'") && !csp.includes("unsafe-inline"), csp)
    check("clickjacking blocked (X-Frame-Options)", r.headers.get("x-frame-options") === "SAMEORIGIN")
    check("MIME sniffing blocked", r.headers.get("x-content-type-options") === "nosniff")
    const html = await r.text()
    check("app page has no inline <script>", !/<script>(?!\s*<\/script>)/.test(html))
}

// 5. Spoofing a trusted origin or a forwarded IP does not stand in for the password.
{
    const r = await get("/api/v1/settings", { Origin: "http://127.0.0.1:43210", "X-Forwarded-For": "127.0.0.1", "X-Real-IP": "127.0.0.1" })
    check("spoofed Origin / X-Forwarded-For still refused", r.status === 401, `HTTP ${r.status}`)
}

// 6. Password guessing is throttled.
{
    let limited = false
    for (let i = 0; i < 15 && !limited; i++) {
        const r = await get("/api/v1/settings", { "X-Seanime-Token": "wrong" + i })
        limited = r.status === 429
    }
    check("repeated wrong passwords get HTTP 429", limited)
    let statusLimited = false
    for (let i = 0; i < 15 && !statusLimited; i++) {
        statusLimited = (await get("/api/v1/status", { "X-Seanime-Token": "guess" + i })).status === 429
    }
    check("guessing through the public status check is throttled too", statusLimited)
    const r = await get("/api/v1/status", { "X-Seanime-Token": TOKEN })
    check("the real password still works after the lockout", !!(await r.json())?.data?.version)
}

// 7. Floods are rate limited.
{
    // Waves of 40: a single 400-wide burst overflows the OS accept queue on Windows before the server sees it.
    const codes = []
    for (let wave = 0; wave < 8; wave++) {
        codes.push(...await Promise.all(Array.from({ length: 40 }, () => get("/api/v1/settings", { "X-Seanime-Token": TOKEN }).then(r => r.status))))
    }
    const limited = codes.filter(c => c === 429).length
    check("a 320-request burst is rate limited", limited > 0, `${limited} of ${codes.length} refused`)
}

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`)
process.exit(failures)
