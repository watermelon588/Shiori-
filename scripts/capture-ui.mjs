// Shiori review captures: real-time rendering, true phone emulation, image-load waits.
// Setup once (outside this repo, because Chrome/puppeteer dislike the 栞 path):
//   mkdir %USERPROFILE%\shiori-capture-tool && cd there && npm i puppeteer-core@23 && copy this file there
// Run (servers on :43000 and :43210 must be up):
//   node capture-ui.mjs <ascii-output-dir> [comma-separated shot names]
// then copy the PNGs into seanime/.impeccable/review/.
import puppeteer from "puppeteer-core"
import fs from "node:fs"
import path from "node:path"
import { createHash } from "node:crypto"

const OUT = process.argv[2]
const BASE = process.env.SHIORI_BASE || "http://localhost:43210"
const only = process.argv[3] ? new Set(process.argv[3].split(",")) : null

const shots = []
for (const v of ["nagi", "ranbu"]) {
    shots.push(
        { name: `desktop-${v}-home`, url: `/?variant=${v}` },
        { name: `desktop-${v}-home-full`, url: `/?variant=${v}`, full: true },
        { name: `desktop-${v}-discover`, url: `/discover?variant=${v}` },
        { name: `desktop-${v}-entry`, url: `/entry?id=154587&variant=${v}`, h: 1500 },
        { name: `desktop-${v}-schedule`, url: `/schedule?variant=${v}` },
        { name: `desktop-${v}-search`, url: `/search?variant=${v}` },
        { name: `desktop-${v}-settings`, url: `/settings?variant=${v}` },
        { name: `desktop-${v}-manga`, url: `/manga?variant=${v}` },
        { name: `site-${v}-discover`, url: `/discover?variant=${v}` },
        { name: `site-${v}-search`, url: `/search?variant=${v}` },
        { name: `site-${v}-sidebar`, url: `/?variant=${v}`, hover: ".shiori-sidebar" },
        { name: `public-${v}-login`, url: `/public/auth?variant=${v}` },
        { name: `public-${v}-privacy`, url: `/public/privacy?variant=${v}`, full: true },
        { name: `public-${v}-terms`, url: `/public/terms?variant=${v}` },
        { name: `public-${v}-guide`, url: `/public/guide?variant=${v}` },
        { name: `public-${v}-credits`, url: `/public/credits?variant=${v}` },
        { name: `public-${v}-support`, url: `/public/support?variant=${v}` },
        { name: `desktop-${v}-guide`, url: `/guide?variant=${v}`, full: true },
        { name: `desktop-${v}-settings-torrent`, url: `/settings?tab=torrent&variant=${v}` },
        { name: `desktop-${v}-settings-client`, url: `/settings?tab=torrent-client&variant=${v}` },
        { name: `desktop-${v}-settings-library`, url: `/settings?tab=library&variant=${v}` },
        { name: `desktop-${v}-sidebar`, url: `/?variant=${v}`, hover: ".shiori-sidebar" },
        { name: `desktop-${v}-lists`, url: `/lists?variant=${v}` },
        { name: `desktop-${v}-downloads`, url: `/torrent-client?variant=${v}` },
        { name: `desktop-${v}-auto-downloader`, url: `/auto-downloader?variant=${v}` },
        { name: `desktop-${v}-debrid`, url: `/debrid?variant=${v}` },
        { name: `mobile-${v}-home`, url: `/?variant=${v}`, mobile: true },
    )
}

const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--hide-scrollbars", "--no-first-run"],
})

// Password-protected servers: log the capture browser in by seeding the app's stored token (never printed).
const TOKEN = process.env.SHIORI_PASSWORD ? createHash("sha256").update(process.env.SHIORI_PASSWORD).digest("hex") : ""

for (const s of shots) {
    if (only && !only.has(s.name)) continue
    const page = await browser.newPage()
    if (TOKEN) await page.evaluateOnNewDocument(t => { try { localStorage.setItem("sea-server-auth-token", JSON.stringify(t)) } catch {} }, TOKEN)
    if (s.mobile) await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
    else await page.setViewport({ width: 1440, height: s.h ?? 900, deviceScaleFactor: 1 })
    await page.goto(BASE + s.url + "&capture", { waitUntil: "domcontentloaded", timeout: 60000 })
    // Let data load and route transitions finish in real time.
    await new Promise(r => setTimeout(r, 6000))
    if (s.full) {
        await page.evaluate(async () => {
            for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 250)) }
            window.scrollTo(0, 0)
        })
    }
    // Wait until every image intersecting the capture area has decoded (max 20s).
    await page.evaluate(async (full) => {
        const deadline = Date.now() + 20000
        const visible = img => { const r = img.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (full || (r.bottom > 0 && r.top < innerHeight)) }
        while (Date.now() < deadline) {
            const pending = [...document.images].filter(i => visible(i) && !(i.complete && i.naturalWidth > 0) && i.loading !== "lazy")
            if (!pending.length) break
            await new Promise(r => setTimeout(r, 300))
        }
    }, !!s.full)
    await new Promise(r => setTimeout(r, 1200))
    const file = path.join(OUT, s.name + ".png")
    if (s.hover) { await page.hover(s.hover); await new Promise(r => setTimeout(r, 600)) }
    await page.screenshot({ path: file, fullPage: !!s.full })
    console.log(s.name)
    await page.close()
}
await browser.close()
