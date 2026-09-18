// Gallery: builds the wall from gallery-data.js, filters with a Flip layout animation, opens a lightbox that
// grows out of the clicked picture, and supports deep links (gallery.html#a147).
gsap.registerPlugin(ScrollTrigger, Flip, SplitText)

const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]
const EASE = "power3.out"
const ART = window.SHIORI_ART || []
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches
const src = (a, size) => `assets/g/${a.id}${a.cut && size === "cut" ? ".cut" : size === "sm" ? ".sm" : ""}.webp`

$("[data-g-count]").textContent = ART.length

// ---------------------------------------------------------------- wall
const grid = $("[data-grid]")
let order = [...ART]
function render() {
    grid.innerHTML = order.map(a => `
        <button class="g-item${a.cut ? " g-item--cut" : ""}" id="${a.id}" data-id="${a.id}" data-role="${a.role}" data-mood="${a.mood}" data-cut="${a.cut}" aria-label="Open image">
            <img src="${src(a, a.cut ? "cut" : "sm")}" alt="" loading="lazy" width="${a.w}" height="${a.h}" />
        </button>`).join("")
    if (!REDUCED) ScrollTrigger.batch(".g-item", { start: "top 96%", once: true, onEnter: els => gsap.from(els, { opacity: 0, y: 40, scale: 0.96, duration: 0.7, stagger: 0.04, ease: EASE }) })
    applyFilter(current, false)
}

// ---------------------------------------------------------------- filters (animated with Flip so items glide into place)
let current = "all"
function applyFilter(f, animate = true) {
    current = f
    const state = animate && !REDUCED ? Flip.getState(".g-item") : null
    $$(".g-item").forEach(el => {
        const show = f === "all" || el.dataset.role === f || el.dataset.mood === f || (f === "cut" && el.dataset.cut === "true")
        el.classList.toggle("is-hidden", !show)
    })
    $$("[data-filter]").forEach(c => c.classList.toggle("is-on", c.dataset.filter === f))
    if (state) Flip.from(state, { duration: 0.6, ease: "power2.inOut", absolute: true, onEnter: els => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 }), onLeave: els => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.3 }) })
    ScrollTrigger.refresh()
}
$$("[data-filter]").forEach(c => c.addEventListener("click", () => applyFilter(c.dataset.filter)))
$("[data-shuffle]").addEventListener("click", () => {
    const state = REDUCED ? null : Flip.getState(".g-item")
    const items = $$(".g-item")
    for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); grid.append(items[j]); items.splice(j, 1) }
    if (state) Flip.from(state, { duration: 0.8, ease: "power2.inOut", stagger: 0.004 })
})

// ---------------------------------------------------------------- lightbox
const lb = $("[data-lb]"), lbImg = $("[data-lb-img]")
let index = -1
const visible = () => $$(".g-item:not(.is-hidden)")
function open(el) {
    const list = visible()
    index = list.indexOf(el)
    const a = ART.find(x => x.id === el.dataset.id)
    lbImg.src = src(a, a.cut ? "cut" : "full")
    $("[data-lb-count]").textContent = `${index + 1} / ${list.length}`
    history.replaceState(null, "", "#" + a.id)
    if (!lb.open) {
        lb.showModal()
        if (!REDUCED) {
            // Grow out of the thumbnail: start at its box, settle centred.
            const from = el.getBoundingClientRect(), to = lbImg.getBoundingClientRect()
            gsap.fromTo(lbImg, { x: from.left + from.width / 2 - (to.left + to.width / 2), y: from.top + from.height / 2 - (to.top + to.height / 2), scale: from.width / Math.max(to.width, 1) },
                { x: 0, y: 0, scale: 1, duration: 0.55, ease: "power3.out" })
        }
    } else if (!REDUCED) {
        gsap.fromTo(lbImg, { opacity: 0.4, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.3, ease: EASE })
    }
}
const step = d => { const list = visible(); open(list[(index + d + list.length) % list.length]) }
grid.addEventListener("click", e => { const b = e.target.closest(".g-item"); if (b) open(b) })
$("[data-lb-close]").addEventListener("click", () => lb.close())
$("[data-lb-prev]").addEventListener("click", () => step(-1))
$("[data-lb-next]").addEventListener("click", () => step(1))
lb.addEventListener("click", e => { if (e.target === lb) lb.close() })
lb.addEventListener("close", () => history.replaceState(null, "", location.pathname))
document.addEventListener("keydown", e => { if (!lb.open) return; if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1) })
// Swipe on touch screens.
let x0 = null
lb.addEventListener("touchstart", e => { x0 = e.touches[0].clientX }, { passive: true })
lb.addEventListener("touchend", e => { if (x0 !== null) { const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); x0 = null } })

// ---------------------------------------------------------------- reel: the refined plates drift; scroll speed pushes them
const plates = ["a146", "a158", "a155", "a160", "a065", "a142", "a043", "a136", "a154", "a151", "a130", "a147", "a131", "a135"]
const tall = ["a129", "a140", "a144", "a134", "a132", "a157", "a149", "a138", "a102", "a103", "a012", "a008"]
$$("[data-reel]").forEach((row, n) => {
    const ids = n === 0 ? plates : tall
    row.innerHTML = [...ids, ...ids].map(id => `<img src="assets/hero/${id}.webp" alt="" loading="lazy" />`).join("")
    if (REDUCED) return
    const dir = Number(row.dataset.reel)
    const tween = gsap.fromTo(row, { xPercent: dir > 0 ? 0 : -50 }, { xPercent: dir > 0 ? -50 : 0, duration: 70, ease: "none", repeat: -1 })
    ScrollTrigger.create({ trigger: ".reel", start: "top bottom", end: "bottom top", onToggle: s => (s.isActive ? tween.play() : tween.pause()),
        onUpdate: s => gsap.to(tween, { timeScale: 1 + Math.min(Math.abs(s.getVelocity()) / 250, 6), duration: 0.3, overwrite: true, onComplete: () => gsap.to(tween, { timeScale: 1, duration: 1.2 }) }) })
})

// ---------------------------------------------------------------- entrance + hover tilt
if (!REDUCED) {
    const split = SplitText.create("[data-g-title]", { type: "chars" })
    gsap.from(split.chars, { yPercent: 100, opacity: 0, rotate: 8, duration: 0.8, ease: "back.out(1.6)", stagger: 0.04 })
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
        grid.addEventListener("pointermove", e => {
            const el = e.target.closest(".g-item"); if (!el) return
            const r = el.getBoundingClientRect()
            gsap.to(el, { rotationY: ((e.clientX - r.left) / r.width - 0.5) * 12, rotationX: -((e.clientY - r.top) / r.height - 0.5) * 12, transformPerspective: 800, duration: 0.4, ease: EASE })
        })
        grid.addEventListener("pointerout", e => { const el = e.target.closest(".g-item"); if (el && !el.contains(e.relatedTarget)) gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.5, ease: EASE }) })
        $$("[data-magnet]").forEach(el => {
            const x = gsap.quickTo(el, "x", { duration: 0.4 }), y = gsap.quickTo(el, "y", { duration: 0.4 })
            el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * 0.25); y((e.clientY - r.top - r.height / 2) * 0.35) })
            el.addEventListener("pointerleave", () => { x(0); y(0) })
        })
    }
}

render()

// Deep link: gallery.html#a147 opens that picture; #manga filters to manga.
window.addEventListener("load", () => {
    const hash = location.hash.slice(1)
    if (hash === "manga") { applyFilter("manga"); $("#wall").scrollIntoView() }
    else if (hash && document.getElementById(hash)?.classList.contains("g-item")) {
        const el = document.getElementById(hash)
        el.scrollIntoView({ block: "center" })
        setTimeout(() => open(el), 300)
    }
    ScrollTrigger.refresh()
})
