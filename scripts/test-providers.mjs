// Smoke-tests every installed Seanime provider against the running server (http://127.0.0.1:43000).
// Usage: node scripts/test-providers.mjs [--only torrent|stream|manga]
const API = process.env.SEANIME_API || "http://127.0.0.1:43000/api/v1"
const HEADERS = { "Content-Type": "application/json", Origin: "http://127.0.0.1:43210", Referer: "http://127.0.0.1:43210/" }
const only = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null

// Frieren: Beyond Journey's End (finished, popular, well seeded)
const ANIME = {
    id: 154587, idMal: 52991, format: "TV", episodes: 28, status: "FINISHED", isAdult: false,
    title: { romaji: "Sousou no Frieren", english: "Frieren: Beyond Journey's End", userPreferred: "Sousou no Frieren" },
    synonyms: ["Frieren at the Funeral"], startDate: { year: 2023, month: 9, day: 29 },
}
const MANGA_ID = Number(process.env.MANGA_ID || 30013) // default One Piece; set MANGA_ID=105398 (Solo Leveling) for manhwa-only sources

async function call(path, body, timeoutMs = 90_000) {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), timeoutMs)
    const started = Date.now()
    try {
        const res = await fetch(API + path, { method: "POST", headers: HEADERS, body: JSON.stringify(body), signal: ctrl.signal })
        const json = await res.json().catch(() => ({}))
        return { ms: Date.now() - started, data: json.data, error: json.error || (!res.ok ? `HTTP ${res.status}` : undefined) }
    } catch (e) {
        return { ms: Date.now() - started, error: e.name === "AbortError" ? "timeout" : String(e) }
    } finally {
        clearTimeout(t)
    }
}

const results = []
const report = (group, provider, ok, detail, ms) => {
    results.push({ group, provider, ok })
    console.log(`${ok ? "PASS" : "FAIL"}  ${group.padEnd(7)} ${provider.padEnd(18)} ${String(ms).padStart(6)}ms  ${detail}`)
}

async function testTorrent(provider) {
    const smart = await call("/torrent/search", { type: "smart", provider, media: ANIME, episodeNumber: 1, batch: false, query: "" })
    const torrents = smart.data?.torrents ?? []
    if (torrents.length) return report("torrent", provider, true, `smart: ${torrents.length} results, e.g. "${torrents[0].name?.slice(0, 60)}"`, smart.ms)
    const simple = await call("/torrent/search", { type: "simple", provider, query: "Frieren", media: ANIME })
    const t2 = simple.data?.torrents ?? []
    report("torrent", provider, t2.length > 0, t2.length ? `simple: ${t2.length} results (smart gave 0)` : `0 results ${smart.error || simple.error || ""}`, smart.ms + simple.ms)
}

async function testStream(provider) {
    const list = await call("/onlinestream/episode-list", { mediaId: ANIME.id, dubbed: false, provider })
    const eps = list.data?.episodes ?? []
    if (!eps.length) return report("stream", provider, false, `episode list empty ${list.error || ""}`, list.ms)
    const src = await call("/onlinestream/episode-source", { mediaId: ANIME.id, episodeNumber: 1, provider, dubbed: false })
    const sources = src.data?.videoSources ?? []
    if (!sources.length) return report("stream", provider, false, `${eps.length} episodes, but no ep1 sources ${src.error || ""}`, list.ms + src.ms)
    const play = await probePlayback(sources[0])
    report("stream", provider, play.ok, `${eps.length} episodes, ${sources.length} source(s), playback: ${play.detail}`, list.ms + src.ms + play.ms)
}

// Fetches the playlist and the first media segment through Seanime's proxy, like the player does.
// Mirrors onlinestream-page.tsx: proxy only when the source carries headers, otherwise hit the URL directly.
async function probePlayback(source) {
    const started = Date.now()
    const base = API.replace(/\/api\/v1$/, "")
    const headers = source.headers || {}
    const useProxy = Object.keys(headers).length > 0
    const proxied = url => useProxy ? `${base}/api/v1/proxy?url=${encodeURIComponent(url)}&headers=${encodeURIComponent(JSON.stringify(headers))}` : url
    // The proxy rewrites playlist URIs to "/api/v1/proxy?..." so those must be fetched as-is, not re-proxied.
    const resolve = (uri, parent) => uri.startsWith("/api/") ? base + uri : new URL(uri, parent).href
    const target = url => url.startsWith(base) ? url : proxied(url)
    const get = async url => {
        const res = await fetch(target(url), { headers: { Origin: HEADERS.Origin } })
        return { status: res.status, text: res.ok ? await res.text() : "" }
    }
    try {
        if (source.type !== "m3u8") {
            const res = await fetch(proxied(source.url), { method: "GET", headers: { Origin: HEADERS.Origin, Range: "bytes=0-1023" } })
            return { ok: res.status < 400, detail: `${source.type} HTTP ${res.status}`, ms: Date.now() - started }
        }
        let url = source.url
        let pl = await get(url)
        if (pl.status >= 400) return { ok: false, detail: `playlist HTTP ${pl.status}`, ms: Date.now() - started }
        const firstUri = text => text.split(/\r?\n/).map(l => l.trim()).find(l => l && !l.startsWith("#"))
        if (pl.text.includes("#EXT-X-STREAM-INF")) {
            url = resolve(firstUri(pl.text), url)
            pl = await get(url)
            if (pl.status >= 400) return { ok: false, detail: `variant HTTP ${pl.status}`, ms: Date.now() - started }
        }
        const seg = resolve(firstUri(pl.text), url)
        const segRes = await fetch(target(seg), { headers: { Origin: HEADERS.Origin } })
        const bytes = segRes.ok ? (await segRes.arrayBuffer()).byteLength : 0
        return { ok: segRes.ok && bytes > 1000, detail: `segment HTTP ${segRes.status}, ${bytes} bytes`, ms: Date.now() - started }
    } catch (e) {
        return { ok: false, detail: String(e).slice(0, 80), ms: Date.now() - started }
    }
}

async function testManga(provider) {
    const ch = await call("/manga/chapters", { mediaId: MANGA_ID, provider })
    const chapters = ch.data?.chapters ?? []
    if (!chapters.length) return report("manga", provider, false, `no chapters ${ch.error || ""}`, ch.ms)
    const pages = await call("/manga/pages", { mediaId: MANGA_ID, provider, chapterId: chapters[0].id, doublePage: false })
    const n = pages.data?.pages?.length ?? 0
    report("manga", provider, n > 0, `${chapters.length} chapters, first chapter pages: ${n} ${pages.error || ""}`, ch.ms + pages.ms)
}

const TORRENT = ["animetosho-new", "nyaa", "seadex"]
const STREAM = ["aq-animepahe-beta", "kaa", "aq-anizone", "aq-anikoto"]
const MANGA = (process.env.MANGA_PROVIDERS || "mangabuddy,mangabats,mangafreak,asurascans,atsumaru,kuramanga,dipland-mangafire").split(",")

if (!only || only === "torrent") await Promise.all(TORRENT.map(testTorrent))
if (!only || only === "stream") for (const p of STREAM) await testStream(p)
if (!only || only === "manga") await Promise.all(MANGA.map(testManga))

const failed = results.filter(r => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} providers working` + (failed.length ? `; failing: ${failed.map(f => f.provider).join(", ")}` : ""))
