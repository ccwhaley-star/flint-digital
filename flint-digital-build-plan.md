# Flint Digital — Website Rebuild & Redesign Plan
### Design direction: "Studio" (editorial / premium boutique)
**Prepared for Claude Code · June 2026**

---

## 0. How to use this document

This is the complete spec to rebuild **flintdigital.ai** in the "Studio" design direction. Two working prototypes ship with this plan — place both in `/design/`:
- **`reference.html`** (from `option-b-studio-grid.html`) — the Studio visual language: colors, type, spacing, grid, components, motion.
- **`reference-homepage.html`** (from `flint-homepage-pillars.html`) — the **interactive homepage**: The Answer in the hero plus the per-pillar live AI tools. This is the canonical reference for the homepage layout and the AI interactions (Section 6A).

Treat the prototypes as the **source of truth for visuals and interaction**. This document is the source of truth for **scope, architecture, content, SEO/AEO, performance, and the serverless function (Section 7A)**.

When the prototype and this document disagree on visuals, follow the prototype. When they disagree on structure/content/SEO, follow this document.

Work through the phases in **Section 9** in order. Do not skip the acceptance criteria.

---

## 1. Project overview

| | |
|---|---|
| **Business** | Flint Digital — AI-first digital agency for small businesses in the Kansas City area |
| **Positioning** | "We make small businesses impossible to ignore online." Built for small business, by small business. |
| **Goal of this project** | Rebuild the existing site in a more premium, editorial "agency" design that raises perceived value and improves conversion to the free-audit CTA |
| **Primary conversion** | Free Audit form submission (and secondary: Calendly call booking) |
| **Audience** | Local service businesses: plumbers, dentists, roofers, HVAC, salons, auto shops, chiropractors, landscapers, electricians, pest control, cleaning services, gyms |

### What must NOT change
- All existing URLs/routes must be preserved (`/work`, `/about`, `/how-it-works`, `/faq`, `/insights`, plus `#services`, `#pricing`, `#cta` anchors on the homepage). Add redirects if any path changes.
- Contact details: phone **(913) 735-1163**, email **info@flintdigital.ai**, Calendly **https://calendly.com/chris-whaley-flintdigital/30min**
- Domain stays **flintdigital.ai** (canonical `https://flintdigital.ai/`).

---

## 2. Non-negotiable constraints

### 2.1 Tech stack
- **Pure static site. No Node.js, no framework, no client-side router.** Hand-coded HTML + one shared CSS file + minimal vanilla JS.
- Hosted on **Netlify**, deployed from **GitHub** (push to main → deploy). No build step required.
- Because there is no build step, the shared header and footer are **duplicated markup** in each `.html` file, all pulling from one shared stylesheet. (Do NOT inject header/footer via client-side `fetch()` — it hurts SEO and performance.)
- *Optional future enhancement, do not implement now:* an 11ty build for partials. Note it in the README as a "later" item only.

### 2.2 Performance budget (this is the product — it must be exemplary)
- Lighthouse **100 / 100 / 100 / 100** (Performance, Accessibility, Best Practices, SEO) on mobile.
- **Sub-1-second** load on a typical connection. Largest Contentful Paint < 1.2s.
- No render-blocking resources. Self-host fonts as `woff2` and `preload` the two used in the hero. No font-loading layout shift (use `font-display: swap` + size-adjust fallbacks).
- Total JS < 10 KB. Total CSS < 30 KB. No jQuery, no UI libraries.
- All images served as **AVIF/WebP** with explicit `width`/`height`, `loading="lazy"` below the fold, and descriptive `alt`.

### 2.3 SEO + AEO (Flint sells this — the site must demonstrate it)
- Every page: unique `<title>`, meta description, canonical, Open Graph + Twitter card tags.
- Valid **JSON-LD structured data** on every page (see Section 7).
- `sitemap.xml`, `robots.txt`, and an **`llms.txt`** at the root (AEO best practice — an AI-first agency should ship one).
- Semantic HTML5, exactly one `<h1>` per page, logical heading order, skip-to-content link.

---

## 3. Design system — "Studio"

> Lift these verbatim from `/design/reference.html`. Put them in `:root` in `assets/css/styles.css`.

### 3.1 Color tokens
```css
:root{
  --paper:#F6F1E9;   /* page background — warm limestone, NOT cream cliché */
  --ink:#1A1611;     /* primary text + dark sections + footer */
  --ox:#7C1F2B;      /* oxblood accent — links, eyebrows, emphasis */
  --ox-soft:#A84450; /* hover / secondary accent */
  --rule:rgba(26,22,17,.16); /* hairline dividers + borders */
  --muted:#5F584E;   /* secondary text */
}
```
**Contrast note:** `--ink` on `--paper` and `--ox` on `--paper` both pass AA. Do not use `--muted` for anything smaller than 14px on `--paper` without verifying contrast. Oxblood is an *accent*, never body text.

### 3.2 Typography
- **Display / headings:** `Libre Caslon Display`, weight 400 only. Used large, with tight letter-spacing (`-0.01em`) and line-height ~1.05. Emphasis words set in italic `--ox`.
- **Body / UI:** `Inter`, weights 400 / 500 / 600.
- **Eyebrows / labels:** Inter 600, 12px, `letter-spacing: .22em`, uppercase, `--ox`.
- Self-host both as `woff2`. Preload the Libre Caslon Display file (hero headline) and the Inter 400 file.
- Type scale (clamp-based, mobile→desktop):
  - h1 `clamp(48px, 8vw, 104px)`
  - h2 `clamp(34px, 5vw, 60px)`
  - h3 `26–30px`
  - body `16–19px`

### 3.3 Layout & spacing
- Content max-width **1120px**, side padding **34px** (24px on mobile).
- Section vertical padding **90px** (60px mobile).
- Generous whitespace is the point. When in doubt, add space.
- **Hairline rules** (1px `--rule`) as the primary structural device — section dividers, the hero index row, the services list.
- **Editorial index headers:** section titles are paired with Roman numerals (`I`, `II`, `III`) set in Libre Caslon `--ox`. Numerals encode real order, don't decorate.
- Borders mostly square (0 radius). Exceptions: **pill buttons** (40px radius) and **image placeholders** (subtle rounding, see prototype).

### 3.4 Components
- **Buttons:** pill shape, `--ink` fill with `--paper` text → on hover fill `--ox`. Outline variant: transparent with `--ink` border → fills `--ink` on hover.
- **Service list:** full-width rows separated by hairlines; on hover the row nudges right (`padding-left` shift). Subtle, no bounce.
- **Work grid:** asymmetric 2-col, even items offset downward (magazine feel). Each case = image placeholder + uppercase meta + serif title + short desc + italic result line.
- **Marquee strip:** hairline-bordered band of value props separated by small `--ox` dots.
- **Pull-quote / testimonial:** centered large serif, dashed-border eyebrow pill above it.

### 3.5 Background grid (subtle, warm, hero-only fade)
A faint editorial grid grounds the top of each page, then fades out so the whitespace breathes. **It must stay barely-there — this is structure, not graph paper.** Do NOT use the blue/technical blueprint grid.
```css
body{ position:relative; }
body::before{
  content:""; position:fixed; inset:0; z-index:0; pointer-events:none;
  background-image:
    linear-gradient(rgba(26,22,17,.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(26,22,17,.045) 1px, transparent 1px);
  background-size:74px 74px;
  -webkit-mask-image:linear-gradient(180deg,#000 0%,rgba(0,0,0,.35) 38%,transparent 70%);
  mask-image:linear-gradient(180deg,#000 0%,rgba(0,0,0,.35) 38%,transparent 70%);
}
/* keep all real content above the grid */
.ribbon, nav, header, section, .pull, footer{ position:relative; z-index:1; }
```
Rules: ink-toned (never blue), **~4.5% opacity**, **74px cells**, and **masked to fade after the hero** (gone by ~70% down the first viewport). Apply the same treatment on every page. The grid is purely decorative — it carries no semantic meaning and must not affect focus, contrast, or layout.

### 3.6 Motion
- Minimal and tasteful. Hover transitions ~0.2–0.25s. One ambient touch max per section.
- **Respect `prefers-reduced-motion: reduce`** — disable all transitions/animations under it.

---

## 4. Global components (build once, reuse on every page)

### 4.1 Header / nav
- Sticky, `rgba(246,241,233,.88)` + `backdrop-filter: blur(10px)`, hairline bottom border.
- Logo: `Flint.digital` — "Flint" + "digital" in Libre Caslon, the `.` in `--ox`.
- Links: Services · Work · About · **Free Audit** (pill button → `#cta`).
- Mobile: collapse links into a hamburger → simple full-screen or dropdown menu (vanilla JS, no library). Keyboard-accessible, focus-trapped when open.

### 4.2 Footer (dark — `--ink` background, `--paper` text)
- Logo + one-line positioning statement.
- Link columns: **Services** (Websites, SEO & Content, AEO, Google Ads) · **Company** (Work, About, How It Works, Pricing, FAQ, Insights) · **Contact** (phone, email, Book a call).
- Bottom row: `© 2026 Flint Digital · Kansas City Area` + flintdigital.ai.

### 4.3 Free Audit form (use **Netlify Forms** — no backend needed)
- Add `data-netlify="true"` + a hidden honeypot field. Netlify captures submissions automatically.
- Fields (preserve from current site): Name, Email, Website URL, and a "What do you need most?" select with options: *New website · Website redesign · SEO & content · Google Ads · AEO / AI search · All of the above*.
- Reassurance microcopy: "No spam. No sales calls unless you want one. Just a free audit in your inbox."
- Success state: redirect to a `/thank-you.html` page (also gives a clean conversion event for analytics).
- Secondary path under the form: **Book a free call** (Calendly) + **Email us**.

---

## 5. Information architecture

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero → marquee → services → work teaser → testimonial → pricing → about teaser → CTA |
| Work | `work.html` | Full portfolio / case studies |
| About | `about.html` | Founder story, "built by operators" credibility, team |
| How It Works | `how-it-works.html` | The 4-step process (audit → strategy → build → grow) |
| FAQ | `faq.html` | Questions + answers (also powers FAQ schema + AEO) |
| Insights | `insights/index.html` | Blog index (SEO/AEO content engine — dogfoods the Grow/Dominate plans) |
| Article template | `insights/_template.html` | Reusable article layout with Article schema |
| Thank you | `thank-you.html` | Post-form-submit confirmation |
| Pricing | `#pricing` on `index.html` | Keep as homepage section (matches current nav) |

---

## 6. Page-by-page spec

### 6.1 Home (`index.html`)
Follows `/design/reference-homepage.html`. Sections in order:
1. **Hero = the hook + "The Answer"** — editorial index row, giant serif headline **"Stop losing customers to *worse competitors.*"**, lede that bridges to AEO (*"They're not better than you — they're just easier to find. On Google, and now in AI answers. See where you stand, live:"*), and the live **Ask-AI widget** (the AEO pillar's proof tool — see Section 6A). The worse-competitors line is the emotional hook; AEO is the mechanism. This widget is the page's star interaction and runs on submit.
2. **Marquee strip** — Be the AI answer · Top of Google · Sites in days · Built by operators.
3. **Pillars (§)** — "Three pillars of *getting found.*" Three editorial rows (descriptive, no inline tools): **01 Answer Engine Optimization** (note "try it live in the hero above"), **02 Google Paid Ads**, **03 Websites & E-Commerce**.
4. **Work teaser** — 3–4 strongest cases in the asymmetric grid, "View all work →" → `work.html`.
5. **Testimonial pull-quote** — *placeholder until real quotes exist (Section 11).*
6. **Pricing** — `#pricing`. Four cards: Website Build $2,500 one-time; Maintain $249/mo; Grow $749/mo (mark "Most popular"); Dominate $1,499/mo. Lists in Section 6.7.
7. **About teaser** — "Built by an operator who runs the playbook on his own businesses first" → `about.html`.
8. **CTA (`#cta`)** — "Let's make you the *answer*", the Netlify audit form (add an "AI visibility" line item), Calendly + email fallback.

### 6A. The live AI tool (the differentiator)
**One** live tool — the **Ask-AI / AI Visibility** widget in the hero. It proves the AEO pillar on the visitor's own business, then funnels to the free audit. It calls the shared serverless function (Section 7A). Match behavior and markup to `/design/reference-homepage.html`.

**Behavior & discipline:**
- Runs on submit in the hero (inputs: business name, city). Calls the function with `search:true` (web search on).
- Renders an honest "what AI can say about you" answer + the AEO gap, tying back to the worse-competitors hook (whichever competitor IS visible wins the customer). Prompt per prototype `askAI()`.
- **Never overpromise.** It's a live look-up, not a guarantee. Never invent reviews, metrics, or facts not actually found. Empty/with-little-found results are framed as the gap, not faked.
- **Lazy, non-blocking.** The tool script is deferred and only fetches on interaction — must not block first paint or the Lighthouse 100.

**Optional dedicated page:** `/ai-visibility.html` — the same Ask-AI tool plus a short explainer, built to rank for AEO-intent searches and to link from ads and social.

*(The earlier Google Ads "Top of Google" and Websites "Mirror" tools were cut to keep the page focused and to run a single AI endpoint. The prototypes for them remain in the chat history if ever revived.)*



### 6.2 Work (`work.html`)
- Headline + intro. Be transparent and reframe as strength: these were built and ranked in-house using the same playbooks deployed for clients.
- Case studies (current set): **Sand Hills Event Center**, **Lawn Care Medics**, **Vintage Bloom**, **Bourbon County Storage**, **Flint Hills Capital**, **Sandhill Storage**.
- Per case: scope tag, short narrative, 2–3 metrics. Keep real metrics (`<1s` load, `100` PageSpeed, `Page 1` rankings). **Mark any business-outcome stat (calls, bookings, traffic) as a placeholder** until Chris supplies real figures — do not invent numbers.
- CTA at the bottom → free audit.

### 6.3 About (`about.html`)
- Founder-forward. Core narrative: Flint Digital isn't faceless — the same systems run a real, growing portfolio of Kansas businesses daily. No jargon, no retainer games, tested with our own money first.
- Include a **founder portrait slot** (placeholder image until Chris provides one).
- Values / how we work. Link to How It Works and CTA.

### 6.4 How It Works (`how-it-works.html`)
- The 4 steps: **01 Free audit → 02 Strategy → 03 Build → 04 Grow**, each with a sentence of detail (see prototype copy).
- Reinforce "days, not months" and the AI-accelerated build. CTA at bottom.

### 6.5 FAQ (`faq.html`)
- 8–12 real questions (pricing, ownership, timelines, "do I own my site," "what is AEO," "do you do contracts," "what areas do you serve"). Concise, factual answers — these double as AEO fuel.
- Must emit **FAQPage** JSON-LD (Section 7).

### 6.6 Insights (`insights/`)
- Blog index + article template. This is the content engine the Grow/Dominate plans sell, so it must be first-class: clean article layout, author, date, reading time, Article + BreadcrumbList schema, and internal links back to services.

### 6.7 Pricing content (exact)
```
WEBSITE BUILD — $2,500 one-time
  • Custom design & development
  • Mobile-first, sub-second load
  • SEO + AEO foundation baked in
  • Google Analytics & Search Console
  • 30-day post-launch support
  • You own everything — code, domain, content

MAINTAIN — $249/mo
  • Hosting, SSL, uptime monitoring
  • Monthly backups
  • SEO rank tracking
  • AEO citation monitoring
  • 30 min of edits per month
  • Monthly status report

GROW — $749/mo  [MOST POPULAR]
  • Everything in Maintain
  • 2 SEO/AEO articles per month
  • Quarterly site refresh & design updates
  • Google Business Profile management
  • Review monitoring & generation strategy
  • Monthly analytics deep-dive
  • Citation building & cleanup

DOMINATE — $1,499/mo
  • Everything in Grow
  • Google Ads build + management
  • 4 SEO/AEO articles per month
  • AI search optimization & monitoring
  • Reputation management & review response
  • Dedicated strategist
  • Quarterly strategy reviews
```

---

## 7A. Serverless function (powers all three AI tools)

The site stays static. The **only** dynamic piece is one Netlify Function that proxies Claude so the API key is never exposed in the browser. It runs on Netlify's infra — nothing to run locally.

**Endpoint:** `POST /.netlify/functions/ask` · body `{ "prompt": "...", "search": true|false }` · returns `{ "text": "..." }`.

**`netlify/functions/ask.js`:**
```js
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };
  // light abuse guard: only accept calls from our own origin
  const origin = event.headers.origin || "";
  if (origin && !origin.endsWith("flintdigital.ai")) return { statusCode: 403, body: "Forbidden" };
  try {
    const { prompt, search } = JSON.parse(event.body || "{}");
    if (!prompt || prompt.length > 2000) return { statusCode: 400, body: "Bad request" };
    const body = {
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    };
    if (search) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
    return { statusCode: 200, headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: "upstream" }) };
  }
};
```

**Client wiring (in `assets/js/tools.js`):** replace the prototype's direct API call with the function call —
```js
async function callClaude(prompt, useSearch){
  const r = await fetch("/.netlify/functions/ask", {
    method:"POST", headers:{"content-type":"application/json"},
    body: JSON.stringify({ prompt, search: !!useSearch })
  });
  if(!r.ok) throw new Error(r.status);
  const d = await r.json();
  return (d.text || "").trim();
}
```
Everything else (`fmt`, `askAI`, `buildAd`, `buildSite`, reveal logic) is copied verbatim from `reference-homepage.html`.

**Setup:**
- Add repo env var **`ANTHROPIC_API_KEY`** in Netlify (Site settings → Environment variables). Never commit the key.
- Enable the **web search** tool on the Anthropic account/key (used by the AEO tool).
- `netlify.toml`: set `functions = "netlify/functions"`.

**Cost & abuse:** these are public AI endpoints, so each run costs tokens. The origin check above blocks off-site abuse; for extra safety add Netlify rate limiting or a hidden per-session nonce. The Ads/Mirror tools are tap-to-reveal so they only run on real intent. Keep `max_tokens` at 1000.



### 7.1 Per-page meta (template)
```html
<title>{Page-specific} · Flint Digital</title>
<meta name="description" content="{≤155 chars, unique per page}">
<link rel="canonical" href="https://flintdigital.ai/{path}">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://flintdigital.ai/og-image.png">
<meta property="og:url" content="https://flintdigital.ai/{path}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

### 7.2 JSON-LD (required)
- **Every page:** `ProfessionalService` (or `LocalBusiness`) for Flint Digital — name, url, telephone `+1-913-735-1163`, email, `areaServed: "Kansas City metropolitan area"`, `priceRange`, logo, sameAs (social links).
- **Home + service sections:** `Service` entries (Web design, SEO, AEO, Google Ads, AI consulting).
- **All sub-pages:** `BreadcrumbList`.
- **FAQ page:** `FAQPage` with each Q/A.
- **Insights articles:** `Article` (headline, author, datePublished, image).
- Add `AggregateRating` / `Review` schema **only once real reviews exist** — leave a clearly commented stub.

### 7.3 Files at root
- `robots.txt` — allow all, point to sitemap.
- `sitemap.xml` — all canonical URLs, lastmod dates.
- `llms.txt` — short markdown index of the site for AI crawlers: who Flint is, services, key page URLs, contact. (On-brand for an AI-first agency and a real AEO signal.)

---

## 8. Accessibility & quality floor
- Keyboard navigable; visible focus states (don't remove outlines — restyle them in `--ox`).
- `prefers-reduced-motion` respected everywhere.
- All images have meaningful `alt`; decorative images `alt=""`.
- Color contrast AA minimum across all text.
- Forms: labels tied to inputs, error states described in text, not color alone.
- Skip-to-content link as first focusable element.
- Test at 320px width up to 1440px+.

---

## 9. Build sequence (do in order)

**Phase 0 — Setup**
- Init repo structure (Section 10). Add `/design/reference.html`. Self-host fonts. Write `styles.css` `:root` tokens + base/reset + typography.
- Acceptance: a blank page renders with correct fonts, colors, and type scale; Lighthouse Best Practices/SEO already 100 on the empty shell.

**Phase 1 — Global chrome**
- Build header (incl. mobile menu) and footer as the reusable markup block; document the exact block in the README so it's copy-pasted identically per page.
- Acceptance: header/footer pixel-match prototype; mobile menu works with keyboard; footer links all resolve.

**Phase 2 — Homepage**
- Build all home sections (6.1) including the Netlify audit form + `thank-you.html`.
- Acceptance: matches prototype; form submits to Netlify and redirects to thank-you; all anchors scroll correctly; Lighthouse 100×4 mobile.

**Phase 2B — AI pillar tools + serverless function**
- Create `netlify/functions/ask.js` (Section 7A) and `netlify.toml`. Add the `ANTHROPIC_API_KEY` env var in Netlify; enable web search on the key.
- Build `assets/js/tools.js` (deferred) with the function-based `callClaude` and the three tools (Section 6A), wired exactly per `reference-homepage.html`. Build the optional `/ai-visibility.html` page.
- Acceptance: all three tools work end-to-end through the function with no key in client code; key absent from browser network tab; tools are tap-to-reveal (Ads/Mirror) and don't run on load; homepage still scores Lighthouse 100×4; every result shows its honest disclaimer caption.

**Phase 3 — Inner pages**
- Build Work, About, How It Works, FAQ in that order. Reuse components.
- Acceptance: each page has unique meta + correct schema; FAQ emits valid FAQPage JSON-LD (test in Google Rich Results Test).

**Phase 4 — Insights**
- Build blog index + one example article from the template.
- Acceptance: Article + BreadcrumbList schema valid; article layout readable and on-brand.

**Phase 5 — SEO/AEO + polish**
- Add sitemap.xml, robots.txt, llms.txt, og-image. Final pass on alt text, contrast, reduced-motion, 404 page.
- Acceptance: all pages 100×4; all structured data valid; no console errors; redirects in place for any changed paths.

---

## 10. Repo / file structure
```
/
├─ index.html
├─ work.html
├─ about.html
├─ how-it-works.html
├─ faq.html
├─ ai-visibility.html        # dedicated Ask-AI tool page (Section 6A)
├─ thank-you.html
├─ 404.html
├─ robots.txt
├─ sitemap.xml
├─ llms.txt
├─ netlify.toml              # functions dir + config
├─ _redirects                # Netlify redirects (preserve old URLs)
├─ /netlify/functions/
│   └─ ask.js                # Claude proxy — keeps API key server-side (Section 7A)
├─ /insights/
│   ├─ index.html
│   └─ _template.html
├─ /design/
│   ├─ reference.html            # Studio visual language (option-b-studio-grid.html)
│   └─ reference-homepage.html   # interactive per-pillar homepage (flint-homepage-pillars.html)
└─ /assets/
    ├─ /css/styles.css
    ├─ /js/main.js           # mobile menu + reduced-motion guard
    ├─ /js/tools.js          # deferred — the 3 AI pillar tools (Section 6A)
    ├─ /fonts/               # self-hosted woff2
    └─ /img/                 # AVIF/WebP, og-image.png
```

---

## 11. Open items Chris must supply (use clearly-marked placeholders until then)
- **Real client testimonials** (name, business, quote) — at least 2–3. Do not fabricate.
- **Real business-outcome metrics** per case study (calls, bookings, traffic lifts). Until provided, keep only the verifiable tech metrics (`<1s`, `100`, `Page 1`) and label outcome figures as placeholders.
- **Founder portrait** + team photos.
- **Social profile URLs** for `sameAs` schema (e.g. X: @whaleychris).
- **OG image** (1200×630) in the Studio look.

---

## 12. Kickoff prompt for Claude Code (copy-paste this)

> I'm rebuilding my digital agency website, flintdigital.ai, in a new "Studio" design direction with live AI tools. The complete spec is in `flint-digital-build-plan.md`. Two prototypes are in `/design/`: `reference.html` (the Studio visual language) and `reference-homepage.html` (the interactive per-pillar homepage — The Answer in the hero plus the live AI tools). Read all three before starting and match the prototypes' visuals and interactions exactly, including the faded background grid (Section 3.5) and the per-pillar tools (Section 6A).
>
> Constraints: pure static HTML + one shared CSS file + minimal vanilla JS, hosted on Netlify from GitHub. The only dynamic piece is one Netlify Function that proxies Claude so my API key stays private (Section 7A) — never put the key in client code. The site must hit Lighthouse 100/100/100/100 on mobile and load in under a second; the AI tool script is deferred and only runs on interaction.
>
> Start with Phase 0 from Section 9 and stop after each phase's acceptance criteria so I can review. Use clearly-marked placeholders for the items in Section 11 — never invent testimonials, client metrics, reviews, or facts. Begin now with Phase 0.
>
> Constraints: pure static HTML + one shared CSS file + minimal vanilla JS. No Node, no framework, no build step. Hosted on Netlify from GitHub. The site must hit Lighthouse 100/100/100/100 on mobile and load in under a second — performance and SEO/AEO are literally the product I sell, so the site has to be exemplary.
>
> Start with Phase 0 (setup, design tokens, self-hosted fonts) from Section 9 and stop after each phase's acceptance criteria so I can review. Use clearly-marked placeholders for the items in Section 11 — never invent testimonials or client metrics. Begin now with Phase 0.

---
*End of plan.*
