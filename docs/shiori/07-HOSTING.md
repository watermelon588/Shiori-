# 07 · Hosting: Running Shiori 24/7

## What has to run all the time

| Piece | Needs |
|---|---|
| Seanime server (Go) | about 150 to 300 MB RAM, any CPU; Linux, Windows or macOS; x86 or ARM |
| Downloads | **lots of disk** (roughly 350 MB to 1.5 GB per episode) plus torrent traffic |
| Agent layer (news, recommendations) | small; outbound internet only |
| PWA | must be served over **HTTPS** so the service worker and push notifications work |

## Options compared

| | A. Always-on box at home + Tailscale (**recommended**) | B. Your laptop stays on + Tailscale | C. Cloud VPS |
|---|---|---|---|
| Cost | one-off ~$120-200 (N100 mini PC) or reuse an old laptop; ~6-10 W power | $0 | ~€4-10 / month, plus storage |
| Files end up | at home, where you watch | on the laptop | in a data centre (must be streamed or copied home) |
| Torrent downloads | fine | fine | **usually against the provider's terms**; copyright complaints lead to suspension |
| Reachable from phone | yes, via a Tailscale private network with free HTTPS on `*.ts.net`, no port forwarding | yes, but only while the laptop is awake | yes, public |
| Breaks when | power or internet cut | lid closed, sleep, laptop taken to work | account suspended, disk full |

## Recommendation

1. **Now (free):** run Shiori on your laptop, install **Tailscale** on the laptop and your phone, and set Windows to never sleep while plugged in. This is enough to build and test the PWA.
2. **When you want real 24/7:** move the Seanime data dir to a **mini PC or old laptop** with a big external drive and keep it at home. Same Tailscale setup; the PWA URL stays the same.
3. **Skip a VPS for downloading.** A small VPS is only worth it later, and only for non-download jobs (e.g. an always-up news/agent worker), if the home box proves unreliable.

## Security basics for any option

- Never expose `:43000` straight to the internet. Use Tailscale, or at minimum set Seanime's server password.
- Secrets (debrid keys, AI API keys) go in environment variables, never in git.
