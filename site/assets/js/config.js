// Site-wide settings. Edit here; both designs, the docs and the legal page read from this file.
window.SHIORI_SITE = {
    // Where the Download buttons point. Until a GitHub Release exists, they scroll to the install section.
    downloadUrl: "https://github.com/watermelon588/Shiori-/releases/latest/download/Shiori-windows-x64.zip",
    githubUrl: "https://github.com/watermelon588/Shiori-",
    // Drop a file at assets/demo.mp4 (and set this to "assets/demo.mp4") or paste a YouTube embed URL.
    demoVideo: "assets/demo.mp4",
    demoPoster: "assets/demo.jpg",
    // The 20-second launch film, shown under the demo when set.
    launchVideo: "assets/launch.mp4",
    launchPoster: "assets/launch.jpg",
    supportEmail: "maityrohit021@gmail.com",
    upiId: "maityrohit021@oksbi",
    maintainer: "Zaxxewu",
    // Donations so far, in INR. Drives the Nagi goal bar and the Pop stamp card (one stamp per 100).
    raised: 0,
    goal: 1500,
}

// Wire every [data-download] / [data-github] / [data-email] link to the settings above.
document.addEventListener("DOMContentLoaded", () => {
    const s = window.SHIORI_SITE
    const installHref = document.getElementById("install") ? "#install" : "docs.html#install"
    document.querySelectorAll("[data-download]").forEach(a => { a.href = s.downloadUrl || (a.getAttribute("href")?.startsWith("#") ? installHref : a.getAttribute("href")) })
    document.querySelectorAll("[data-github]").forEach(a => {
        if (s.githubUrl) a.href = s.githubUrl
        else a.remove()
    })
    document.querySelectorAll("[data-email]").forEach(a => { a.href = "mailto:" + s.supportEmail; if (!a.children.length) a.textContent = s.supportEmail })
    document.querySelectorAll("[data-upi]").forEach(el => { el.textContent = s.upiId })
    document.querySelectorAll("[data-upi-link]").forEach(a => {
        a.href = "upi://pay?" + new URLSearchParams({ pa: s.upiId, pn: s.maintainer, cu: "INR", tn: "Shiori donation" })
    })
    document.querySelectorAll("[data-year]").forEach(el => { el.textContent = new Date().getFullYear() })

    // Demo video: real file or embed when configured, otherwise the "coming soon" poster stays.
    const slot = document.querySelector("[data-demo]")
    if (slot && s.demoVideo) {
        const isEmbed = /youtube|youtu\.be|vimeo/.test(s.demoVideo)
        slot.innerHTML = isEmbed
            ? `<iframe src="${s.demoVideo}" title="Shiori demo" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`
            : `<video src="${s.demoVideo}" controls playsinline preload="metadata"${s.demoPoster ? ` poster="${s.demoPoster}"` : ""}></video>`
        slot.classList.add("has-video")
    }
    // Launch film: a second player right after the demo frame.
    const anchor = slot && slot.closest(".demo__frame, .tv__set")
    if (anchor && s.launchVideo) {
        const film = document.createElement("div")
        film.className = "launch-film"
        film.innerHTML = `<p>The 20-second launch film</p><video src="${s.launchVideo}" controls playsinline preload="metadata"${s.launchPoster ? ` poster="${s.launchPoster}"` : ""}></video>`
        anchor.insertAdjacentElement("afterend", film)
    }
})
