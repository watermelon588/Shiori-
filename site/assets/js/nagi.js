// Nagi motion. Each block says what the animation tells the visitor. Reduced motion gets the final layout.
gsap.registerPlugin(ScrollTrigger, SplitText)

const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]
const EASE = "power3.out"
// One smoothing value for every scrubbed animation: the playhead eases toward the scroll position instead of snapping.
const SCRUB = 0.8
const ART = window.SHIORI_ART || []
const img = (id, size = "sm") => `assets/g/${id}${size ? "." + size : ""}.webp`
// Deterministic shuffle so the page looks the same on every visit (no layout jump between reloads).
const shuffle = (list, seed = 7) => list.map((v, i) => [((i + 1) * 9301 + seed * 49297) % 233280, v]).sort((a, b) => a[0] - b[0]).map(p => p[1])

// ---------------------------------------------------------------- page chrome
// Nav gains a surface once content slides under it; the download pill appears once the hero button has left,
// then steps aside while the full install call-to-action is already in view.
ScrollTrigger.create({ start: 40, end: "max", onToggle: s => $("[data-nav]").classList.toggle("is-stuck", s.isActive) })
{
    const pill = $("[data-pill]")
    let heroHasLeft = false, installIsVisible = false
    const updatePill = () => pill.classList.toggle("is-shown", heroHasLeft && !installIsVisible)
    ScrollTrigger.create({ trigger: "[data-hero]", start: "bottom 70%", end: "max", onToggle: s => { heroHasLeft = s.isActive; updatePill() } })
    ScrollTrigger.create({ trigger: "#install", start: "top bottom", end: "bottom top", onToggle: s => { installIsVisible = s.isActive; updatePill() } })
}

// ---------------------------------------------------------------- hero stills + thumbnails
{
    const stills = $$("[data-still]"), thumbs = $$("[data-thumb]")
    let i = 0, timer = null
    const show = n => {
        stills[i].classList.remove("is-on"); thumbs[i]?.classList.remove("is-on")
        i = (n + stills.length) % stills.length
        stills[i].classList.add("is-on"); thumbs[i]?.classList.add("is-on")
    }
    const run = on => { clearInterval(timer); timer = on && !document.hidden ? setInterval(() => show(i + 1), 7000) : null }
    thumbs.forEach((t, n) => t.addEventListener("click", () => { show(n); run(true) }))
    ScrollTrigger.create({ trigger: "[data-hero]", start: "top bottom", end: "bottom top", onToggle: s => run(s.isActive) })
    document.addEventListener("visibilitychange", () => run(!document.hidden && ScrollTrigger.isInViewport($("[data-hero]"))))
}

// ---------------------------------------------------------------- generated image sections
// The cast: cut-out figures spread across a stage, big in front and small behind.
const castStage = $("[data-cast-stage]")
const cutouts = shuffle(ART.filter(a => a.cut), 3).slice(0, 13)
cutouts.forEach((a, n) => {
    const depth = [0.55, 0.75, 1][n % 3]
    const fig = document.createElement("figure")
    fig.className = "figure"
    fig.dataset.depth = depth
    fig.style.cssText = `--h:${Math.round(depth * 88)}%; left:${(n / cutouts.length) * 92 - 2}%; z-index:${Math.round(depth * 10)}`
    fig.innerHTML = `<img src="${img(a.id, "cut")}" alt="" loading="lazy" />`
    castStage.append(fig)
})

// Manga columns: every black-and-white page, dealt into four columns.
const inkCols = $("[data-ink-cols]")
const manga = shuffle(ART.filter(a => a.role === "manga"), 5)
for (let c = 0; c < 4; c++) {
    const col = document.createElement("div")
    col.className = "ink__col"
    col.innerHTML = manga.filter((_, n) => n % 4 === c).concat(manga.filter((_, n) => n % 4 === (c + 2) % 4).slice(0, 2))
        .map(a => `<img src="${img(a.id)}" alt="" loading="lazy" />`).join("")
    inkCols.append(col)
}

// Gallery wall: 32 pieces not used elsewhere, each linking into the full gallery.
const used = new Set(["a146", "a158", "a155", "a160", "a065", "a142", "a147", "a129", "a131", "a135", "a043", "a138", "a154",
    "a134", "a144", "a012", "a140", "a149", "a136", "a132", "a157", "a102", "a130", "a103", ...cutouts.map(a => a.id), ...manga.map(a => a.id)])
$("[data-wall3d-plane]").innerHTML = shuffle(ART.filter(a => !used.has(a.id) && a.role !== "manga"), 11).slice(0, 32)
    .map(a => `<a href="gallery.html#${a.id}" aria-label="Open in the gallery"><img src="${img(a.id)}" alt="" loading="lazy" /></a>`).join("")

// Domain goal from config.js.
{
    const { raised = 0, goal = 1500 } = window.SHIORI_SITE || {}
    const inr = n => "₹" + n.toLocaleString("en-IN")
    $("[data-goal-text]").innerHTML = `<b>${inr(raised)}</b> of ${inr(goal)}`
    gsap.to("[data-goal-bar]", { scaleX: Math.min(1, raised / goal), duration: 1.2, ease: EASE, scrollTrigger: { trigger: "#support", start: "top 75%", once: true } })
}

const mm = gsap.matchMedia()

mm.add("(prefers-reduced-motion: no-preference)", () => {
    // Load: the still settles from a slight zoom, then the headline rises line by line (the first read).
    const split = SplitText.create("[data-split]", { type: "lines", mask: "lines" })
    gsap.timeline({ defaults: { ease: EASE } })
        .from("[data-hero-frame]", { scale: 1.06, opacity: 0, duration: 1.4 })
        .from(split.lines, { yPercent: 110, duration: 1, stagger: 0.09 }, 0.35)
        .from("[data-hero] [data-rise]", { y: 24, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.75)
        .from(".hero__jp", { opacity: 0, y: -20, duration: 1.2 }, 0.9)

    // Scroll: the full-bleed hero folds into a rounded card, handing the stage to what follows.
    gsap.to("[data-hero-frame]", { clipPath: "inset(6% 4% 10% 4% round 28px)", ease: "none", scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: SCRUB } })
    gsap.to(".hero__copy, .hero__thumbs", { yPercent: -30, opacity: 0, ease: "none", scrollTrigger: { trigger: "[data-hero]", start: "30% top", end: "bottom top", scrub: SCRUB } })

    // The app tilts up from the table: the first sight of the real product.
    gsap.fromTo("[data-tilt]", { rotateX: 24, scale: 0.88, y: 60 }, { rotateX: 0, scale: 1, y: 0, ease: "none", scrollTrigger: { trigger: "[data-tilt]", start: "top 95%", end: "top 25%", scrub: SCRUB } })

    // Seasons: the pinned label follows whichever season's stills are in view; plates drift at their own pace.
    $$("[data-season]").forEach(group => {
        ScrollTrigger.create({
            trigger: group, start: "top 55%", end: "bottom 55%",
            onToggle: s => s.isActive && $$("[data-season-label]").forEach(l => l.classList.toggle("is-on", l.dataset.seasonLabel === group.dataset.season)),
        })
    })
    $$(".plate").forEach((p, n) => gsap.fromTo(p, { y: 60 + (n % 3) * 30 }, { y: -40 - (n % 3) * 30, ease: "none", scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: SCRUB } }))

    // Cast: figures rise into place, then breathe (a slow float), so the crowd feels alive but calm.
    $$(".figure").forEach((f, n) => {
        gsap.from(f, { yPercent: 40, opacity: 0, duration: 1, ease: EASE, delay: (n % 6) * 0.06, scrollTrigger: { trigger: "[data-cast]", start: "top 70%", once: true } })
        gsap.to(f.firstChild, { y: -10 - (n % 3) * 4, duration: 2.6 + (n % 4) * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1 })
    })

    // Manga columns move against each other as you scroll: pages flipping past.
    $$(".ink__col").forEach((col, n) => gsap.fromTo(col, { yPercent: n % 2 ? -18 : 4 }, { yPercent: n % 2 ? 4 : -22, ease: "none", scrollTrigger: { trigger: "[data-ink]", start: "top bottom", end: "bottom top", scrub: SCRUB } }))

    // Gallery wall lies back on the table, then stands up to face you as you arrive.
    gsap.fromTo("[data-wall3d-plane]", { rotateX: 48, scale: 0.9, y: 80 }, { rotateX: 8, scale: 1, y: 0, ease: "none", scrollTrigger: { trigger: "[data-wall3d]", start: "top 90%", end: "center 55%", scrub: SCRUB } })
    ScrollTrigger.batch("[data-wall3d-plane] a", { start: "top 95%", once: true, onEnter: els => gsap.from(els, { opacity: 0, y: 28, duration: 0.8, stagger: 0.025, ease: EASE }) })

    // Two worlds: scrolling wipes the calm home screen into the loud one.
    gsap.to("[data-wipe]", { clipPath: "inset(0 0% 0 0)", ease: "none", scrollTrigger: { trigger: "[data-worlds]", start: "top 70%", end: "bottom 60%", scrub: SCRUB } })

    // Generic entrance for supporting copy and steps.
    ScrollTrigger.batch("main > section:not(.hero) [data-rise]", { start: "top 88%", once: true, onEnter: els => gsap.from(els, { y: 28, opacity: 0, duration: 0.8, ease: EASE, stagger: 0.08 }) })

    // The mascot marquee drifts, slows under the cursor, and stops while off-screen.
    const row = $("[data-marquee]")
    row.append(...[...row.children].map(n => n.cloneNode(true)))
    const drift = gsap.to(row, { xPercent: -50, duration: 40, ease: "none", repeat: -1 })
    ScrollTrigger.create({ trigger: row, start: "top bottom", end: "bottom top", onToggle: s => (s.isActive ? drift.play() : drift.pause()) })
    row.addEventListener("pointerenter", () => gsap.to(drift, { timeScale: 0.2, duration: 0.6 }))
    row.addEventListener("pointerleave", () => gsap.to(drift, { timeScale: 1, duration: 0.6 }))

    return () => split.revert()
})

// Desktop-only choreography (phones get plain stacked content and native swipes).
mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", () => {
    // Sticky stack: each feature card recedes as the next one lands on it.
    const cards = $$(".stack__card")
    cards.forEach((card, n) => {
        if (n === cards.length - 1) return
        gsap.to(card, { scale: 0.93, ease: "none", scrollTrigger: { trigger: cards[n + 1], start: "top bottom", end: "top 90px", scrub: SCRUB } })
    })

    // Tour: vertical scroll pans the strip of app screens sideways.
    const track = $("[data-pan-track]")
    const distance = () => track.scrollWidth - innerWidth
    gsap.to(track, { x: () => -distance(), ease: "none", scrollTrigger: { trigger: "[data-pan]", start: "top top", end: () => "+=" + distance(), pin: true, anticipatePin: 1, scrub: SCRUB, invalidateOnRefresh: true } })
})

// Pointer-only micro-interactions: tilt toward the cursor, magnetic buttons, cast leaning away.
mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
    $$("[data-hover3d]").forEach(el => {
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: EASE }), ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: EASE })
        gsap.set(el, { transformPerspective: 900 })
        el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 10); rx(-((e.clientY - r.top) / r.height - 0.5) * 10) })
        el.addEventListener("pointerleave", () => { rx(0); ry(0) })
    })
    $$("[data-magnet]").forEach(el => {
        const x = gsap.quickTo(el, "x", { duration: 0.4, ease: EASE }), y = gsap.quickTo(el, "y", { duration: 0.4, ease: EASE })
        el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * 0.25); y((e.clientY - r.top - r.height / 2) * 0.35) })
        el.addEventListener("pointerleave", () => { x(0); y(0) })
    })
    const figs = $$(".figure").map(f => ({ d: Number(f.dataset.depth), x: gsap.quickTo(f, "x", { duration: 1, ease: EASE }) }))
    $("[data-cast]").addEventListener("pointermove", e => { const nx = e.clientX / innerWidth - 0.5; figs.forEach(f => f.x(-nx * 60 * f.d)) })
})

mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set("[data-wipe]", { clipPath: "inset(0 50% 0 0)" })
})

// Triggers below the pinned tour were partly created before it (goal bar, matchMedia order). Sorting puts every
// trigger back in page order so the pin's spacing is counted before the sections under it are measured.
window.addEventListener("load", () => { ScrollTrigger.sort(); ScrollTrigger.refresh() })
