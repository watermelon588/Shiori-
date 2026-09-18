# 13 · Donations

The page is `/public/support` (public, linked from the public nav and the in-app footer). All settings live in
**`seanime-web/src/lib/shiori/support.ts`**. Every empty method is hidden; with none filled in, the page says donations are not open yet.
After editing, rebuild the UI (`npx rsbuild build`, copy `out/` into `web/`) and the server binary.

No payment code runs inside Shiori: every option is a link to the provider's own checkout, so Shiori never touches card data and needs no payment backend.

## Read this first: your real name shows up

Donating reveals the **receiver's bank-verified name** on almost every rail, whatever the page says:

| Method | What the donor sees |
|---|---|
| UPI | Your bank account name (the `pn=Zaxxewu` label is overridden by most apps after the payment) |
| PayPal (personal) | Your legal name |
| Stripe / Dodo | The business or statement name you register (can be a brand, after KYC) |

If staying "Zaxxewu" matters, use Dodo or Stripe with a **brand/statement name**, not personal UPI or PayPal.

## 1. UPI: GPay, PhonePe, Paytm (easiest, free)

1. Find your UPI ID: GPay → profile photo → your UPI ID (e.g. `name@okaxis`). PhonePe: profile → UPI IDs.
2. Export your QR: GPay → profile → *Your QR code* → save image. Save it as
   `seanime-web/public/shiori/support/upi-qr.png`.
3. In `support.ts`: `upiId: "name@okaxis"`, `upiQr: "/shiori/support/upi-qr.png"`.

Phones get a "Pay with a UPI app" button (`upi://pay?...` opens the installed app); computers get the QR and a copy button.
Money lands straight in your bank account. Limits: Indian payers only; personal UPI is meant for personal payments, so very
large or frequent receipts can prompt questions from your bank.

## 2. Dodo Payments (cards + international, works for Indian individuals)

1. Sign up at dodopayments.com, finish KYC (PAN, bank account). Set a brand name such as "Shiori" so donors do not see your legal name.
2. Create a product: type *Pay what you want* or a fixed "Donation", then create a **payment link**.
3. Paste it into `support.ts` → `dodo`.

Dodo acts as merchant of record (handles tax on international cards) and charges a percentage per payment; check their current pricing.

## 3. PayPal (international only)

PayPal India accounts cannot receive payments from other Indian accounts, only from abroad. If that is fine:
1. Create a paypal.me link at paypal.me (profile → PayPal.Me).
2. `support.ts` → `paypal: "https://paypal.me/<name>"`.

## 4. Stripe (probably not available to you)

New Stripe India accounts are invite-only and expect a registered business. If you get one: Stripe Dashboard →
*Payment Links* → create a "customer chooses price" link → `support.ts` → `stripe`.

## 5. Ko-fi / Buy Me a Coffee (optional)

A hosted tip page with notes and supporter lists. Payouts go through PayPal or Stripe, so the limits above apply.
`support.ts` → `kofi`.

## Keeping the promise honest

- The page shows **a goal, not a guarantee**: "A permanent home: shiori domain", ₹1,500 (about three years of a `.app`/`.xyz`).
  Update `goal.raised` by hand when money arrives.
- When the goal is met, buy the domain, say so on the page, and move `goal` to the next cost (renewals).
- The page states donations are voluntary gifts, not purchases, not refundable, and buy no access. Keep it that way: selling access to
  a tool that streams from unofficial sources is what gets payment accounts frozen.

## Risks to know

- **Account freezes.** Stripe, PayPal and Dodo prohibit businesses around copyright infringement. A donation page for an app whose
  sources are unofficial streaming and torrent sites can get the account restricted and funds held. UPI to your own bank is the lowest-risk rail here.
- **Tax.** In India, gifts from non-relatives above ₹50,000 in a year are taxable income. Keep a simple record of what comes in.
