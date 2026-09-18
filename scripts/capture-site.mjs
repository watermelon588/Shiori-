// Screenshots of the marketing site (site/) at several scroll depths, in real time so GSAP scrubs settle.
// Usage (run from %USERPROFILE%\shiori-capture-tool, site served on :4600):
//   node capture-site.mjs <out-dir> <page.html> [width]
import puppeteer from "puppeteer-core"
import path from "node:path"

const [OUT, PAGE = "index.html", WIDTH = "1440"] = process.argv.slice(2)
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--hide-scrollbars"] })
const page = await browser.newPage()
const mobile = Number(WIDTH) < 600
await page.setViewport({ width: Number(WIDTH), height: mobile ? 844 : 900, isMobile: mobile, hasTouch: mobile })
page.on("pageerror", e => console.log("PAGE ERROR", e.message))
page.on("console", m => m.type() === "error" && console.log("CONSOLE", m.text()))
await page.goto("http://127.0.0.1:4600/" + PAGE, { waitUntil: "networkidle2", timeout: 60000 })
await new Promise(r => setTimeout(r, 2500))

const height = await page.evaluate(() => document.documentElement.scrollHeight)
const stops = Math.max(12, Math.ceil(height / 1100))
const name = PAGE.replace(".html", "") + (mobile ? "-m" : "")
for (let i = 0; i < stops; i++) {
    const y = Math.round((height - 900) * (i / (stops - 1)))
    // Scroll in small steps so scrubbed timelines and lazy images catch up, like a real visitor.
    await page.evaluate(async target => {
        const from = window.scrollY, steps = 12
        for (let s = 1; s <= steps; s++) { window.scrollTo(0, from + (target - from) * s / steps); await new Promise(r => setTimeout(r, 60)) }
    }, y)
    await new Promise(r => setTimeout(r, 1300))
    await page.screenshot({ path: path.join(OUT, `${name}-${String(i).padStart(2, "0")}.png`) })
}
console.log(name, "height", height)
await browser.close()
