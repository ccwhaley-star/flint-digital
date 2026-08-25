# Flint Digital — Design Audit

Audited 2026-08-09 against `main` (post Kansas City removal / hero update).
Method: full-page renders of all six pages at 1440px and 390px, plus source
review of all CSS/JS. Ordered by priority.

## What's working (keep)

- **Art direction is strong and consistent** — dark warm palette, copper
  accent, mono/sans type pairing, browser-chrome portfolio frames, grid +
  noise texture. All six pages feel like one site.
- **Accessibility fundamentals are in place:** `:focus-visible` outlines,
  `prefers-reduced-motion` support, 44px hamburger tap target, one `h1` per
  page, labeled form fields (`for`/`id` pairs), the site's only `<img>` has
  proper `alt`.
- **Performance fundamentals:** self-hosted variable fonts with
  `font-display:swap`, lazy loading, no framework weight (~1k lines CSS/JS
  total).
- Mobile nav, footer collapse, and the new three-line hero eyebrow (accent
  line hidden under 900px) all render cleanly.

## P0 — visible bugs

### 1. FAQ answers get clipped on mobile — FIXED 2026-08-09
`.faq-answer` opens to `max-height:300px` (v2-global.css). The longest
answers are ~280 characters at 22px/1.85 line-height — roughly 370px tall
when wrapped at phone width — so the tail of long answers is cut off with no
indication. Fix: raise the clamp (e.g. 600px) or set `max-height` from
`scrollHeight` in the accordion JS.

**Status:** fixed — the accordion now sets `max-height` from `scrollHeight`
(+20px padding allowance) in `js/v2-interactions.js`; the CSS clamp is gone.
Verified: the longest answer opens un-clipped at 390px width.

### 2. Live iframes as portfolio previews (12 across home + work) — PARTIALLY FIXED 2026-08-09
Each preview embeds the real client site in an `<iframe>`:

- **Performance:** scrolling the homepage loads six complete external
  websites (each with its own fonts/images/JS), on mobile too. `loading="lazy"`
  only delays the cost.
- **Fragility:** if any client site adds `X-Frame-Options`/CSP
  `frame-ancestors`, its card silently goes blank. One preview points at a
  staging URL (`vintagebloom.netlify.app/home-alt`) that can diverge or die.
- **Broken scaling:** iframes are hardcoded `1440px × scale(0.36)` = 518px
  of rendered content. In the ~350px mobile column the right third is
  cropped; on wide screens the card under-fills.
- **A11y:** the iframes are `aria-hidden="true"` but remain
  keyboard-focusable — hidden-but-focusable is a WCAG failure. (If iframes
  stay, add `tabindex="-1"`.)

**Recommendation:** replace with static WebP screenshots inside the existing
browser-chrome styling — same look, ~30KB each, can't break, and the card
itself already links to the live site.

**Status:** scaling and accessibility are fixed — iframes now scale to their
real container width via JS (`shared/js/nav.js`) and carry `tabindex="-1"`.
Weight and fragility remain: swapping in static screenshots requires
capturing the live client sites, which this sandbox's network policy blocks.
Capture them from a normal machine and drop them into the existing frames.

### 3. Case color-coding stops at card 3 — FIXED 2026-08-09
`v2-work.css` colors `.case-tag`, `.case-metric h4`, and `.case-link` via
`:nth-child(1/2/3)` (copper/slate/sage) — but the work page has **six**
cases. Cards 4–6 (Bourbon County, Vintage Bloom, Sandhill) fall back to
default white for tags, metrics, and links, which reads as a mistake next to
the first three. Fix: cycle with `:nth-child(3n+1/3n+2/3n)`.

**Also found while fixing:** the metric-color rules targeted `.case-metric h4`
but the markup uses `<h3>` — so metric numbers were unstyled on *all six*
cards, not just 4–6. Selectors corrected to `h3`; the same fix cycles the
homepage `.proof-meta` colors, which had the identical 1/2/3 limitation.

## P1 — consistency & polish — ALL FIXED 2026-08-09

Resolutions: unified the savings claim on **40–60%** (the honest range);
FAQ questions now 20px/`--text` over 17px answers (homepage `.faq-grid`
rules turned out to be dead code — index has no FAQ section); **Insights
unlinked** from all footers, sitemap.xml, and llms.txt until real posts
exist (the page itself stays live at /insights.html — relink when content
ships); `--dim` micro-text bumped to `--text2` (audit-form note + all
browser-bar URL labels); `aria-current="page"` + copper active state added
for Work and About in desktop and mobile nav; hero CTA shortened to
**"See What They're Doing Better"** (one line on mobile).

4. **Conflicting stat:** the homepage metric card says **"60% below agency
   rates"**; the About stats row says **"40–60%"**. Pick one number.
5. **Inverted FAQ type hierarchy:** questions are 18px, answers 22px — the
   answer visually outranks the question. Swap the emphasis (questions ≥
   answers).
6. **Insights page is all "COMING SOON":** three posts, zero readable — yet
   it's linked from every footer and llms.txt. A visible empty blog reads
   worse than no blog. Publish at least one post or unlink the page until
   content exists.
7. **Low-contrast micro-text:** `--dim` (#6b6459 ≈ 3.5:1 on the background)
   is used on 10–11px text (the "usually takes 30–60 seconds" note, the
   browser-bar URLs). Below WCAG AA for text that small — bump to `--text2`
   or enlarge.
8. **No current-page indicator in the nav:** Work/About/etc. are never
   highlighted when you're on them. Add `aria-current="page"` plus a copper
   underline/color on the active link.
9. **Hero primary CTA is long:** "Find Out Why They Have a Better Website"
   wraps to two lines on mobile. Something like "See What They're Doing
   Better" keeps the hook in one line.

## P2 — hygiene — FIXED 2026-08-09 (item 13 needed no action)

Resolutions: deleted `sandhills-preview.png` and `chris-whaley.png` (3.4MB
off every deploy); founder photo converted to `chris-whaley-clean.webp`
(240KB PNG → 8.6KB WebP at the same rendered 400px, markup updated);
`rel="noopener"` added to all 15 `target="_blank"` links (9 home, 6 work).

10. **3.4MB of dead assets deploy with the site** (`publish = "."`):
    `sandhills-preview.png` (3.3MB) and `chris-whaley.png` (62KB) are
    referenced by nothing. Delete or exclude.
11. **Founder photo is a 240KB PNG** (`chris-whaley-clean.png`) shown at
    200px. A resized WebP would be ~20KB.
12. **`rel="noopener"` missing** on all 16 `target="_blank"` links. Modern
    browsers imply it, but adding costs nothing and covers older ones.
13. `og-image.html` deploys as a public page — already `Disallow`ed in
    robots.txt, so this is fine; just noting it's intentional.
