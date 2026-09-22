// Ranbu motion: loud, but every move has a job (noted above each block). Reduced motion gets the final layout.
gsap.registerPlugin(ScrollTrigger)

const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]

// Download sticker appears once the hero's own button has scrolled away, then clears the checkout section.
{
    const pill = $("[data-pill]")
    let heroHasLeft = false, checkoutIsVisible = false
    const updatePill = () => pill.classList.toggle("is-shown", heroHasLeft && !checkoutIsVisible)
    ScrollTrigger.create({ trigger: ".hero", start: "bottom 70%", end: "max", onToggle: s => { heroHasLeft = s.isActive; updatePill() } })
    ScrollTrigger.create({ trigger: "#receipt", start: "top bottom", end: "bottom top", onToggle: s => { checkoutIsVisible = s.isActive; updatePill() } })
}

// Stamp card: one stamp per ₹100 raised (set SHIORI_SITE.raised in config.js).
{
    const raised = window.SHIORI_SITE?.raised || 0
    const cells = $$("[data-stamps] span:not(.card__goal)")
    cells.slice(0, Math.min(cells.length, Math.floor(raised / 100))).forEach(c => c.classList.add("is-stamped"))
    $("[data-stamps]").setAttribute("aria-label", `${Math.min(15, Math.floor(raised / 100))} of 15 stamps`)
}

const mm = gsap.matchMedia()

mm.add("(prefers-reduced-motion: no-preference)", () => {
    // Load: the three word-slabs slam onto the wall, then the stickers get slapped on one by one.
    gsap.timeline()
        .from("[data-slab]", { scale: 1.5, opacity: 0, rotate: gsap.utils.wrap([-14, 10, -8]), duration: 0.55, ease: "back.out(2.2)", stagger: 0.12 })
        .from("[data-sticker]", { scale: 1.6, opacity: 0, rotate: () => gsap.utils.random(-30, 30), duration: 0.5, ease: "back.out(2)", stagger: 0.08 }, 0.2)
        .from("[data-pop]", { y: 24, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 }, 0.55)

    // Stickers drift with the cursor at different depths, so the wall reads as layers of paper.
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const movers = $$("[data-depth]").map(el => ({
            d: Number(el.dataset.depth),
            x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
            y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }),
        }))
        $("[data-wall]").closest(".hero").addEventListener("pointermove", e => {
            const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5
            movers.forEach(m => { m.x(nx * 26 * m.d); m.y(ny * 20 * m.d) })
        })
    }

    // The LED ticker runs, and flips direction with the scroll, like it is reacting to you.
    const row = $("[data-ticker]")
    row.append(...[...row.children].map(n => n.cloneNode(true)))
    const tick = gsap.to(row, { xPercent: -50, duration: 28, ease: "none", repeat: -1 })
    ScrollTrigger.create({
        trigger: ".ticker", start: "top bottom", end: "bottom top",
        onToggle: s => (s.isActive ? tick.play() : tick.pause()),
        onUpdate: s => gsap.to(tick, { timeScale: s.direction, duration: 0.4, overwrite: true }),
    })

    // Shelf boxes arrive crooked and straighten as they reach eye level: products being faced on a shelf.
    $$("[data-box]").forEach((box, i) => {
        gsap.fromTo(box, { rotate: i % 2 ? 7 : -6, y: 90 }, {
            rotate: 0, y: 0, ease: "none",
            scrollTrigger: { trigger: box, start: "top bottom", end: "top 55%", scrub: true },
        })
    })

    // Four ways: the number counts up, then each option flips in (sequence matches the sentence).
    const count = { n: 0 }
    gsap.timeline({ scrollTrigger: { trigger: ".ways", start: "top 70%", once: true } })
        .to(count, { n: 4, duration: 0.8, ease: "power2.out", onUpdate: () => ($("[data-count]").textContent = Math.round(count.n)) })
        .from("[data-way]", { rotateX: -90, opacity: 0, transformOrigin: "50% 0", duration: 0.6, ease: "back.out(1.8)", stagger: 0.1 }, 0.3)

    // The receipt prints out line by line (stepped, like a thermal printer).
    gsap.from("[data-receipt]", { scaleY: 0, duration: 1.4, ease: "steps(14)", scrollTrigger: { trigger: "[data-receipt]", start: "top 80%", once: true } })

    // Stamps pop in when the card comes into view.
    gsap.from("[data-stamps] span", { scale: 0.4, opacity: 0, duration: 0.35, ease: "back.out(2)", stagger: 0.03, scrollTrigger: { trigger: "[data-stamps]", start: "top 80%", once: true } })
})

// Tour: the manga panels pan sideways while the section is pinned (desktop; phones swipe natively).
mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
    const track = $("[data-panels-track]")
    const distance = () => track.scrollWidth - innerWidth
    gsap.to(track, {
        x: () => -distance(), ease: "none",
        scrollTrigger: { trigger: "[data-panels]", start: "top top", end: () => "+=" + distance(), pin: true, scrub: 1, invalidateOnRefresh: true },
    })
})

window.addEventListener("load", () => ScrollTrigger.refresh())
