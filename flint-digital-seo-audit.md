# Flint Digital — SEO / AEO Audit

Audited 2026-08-26 against `main` (post design-audit fixes, post
de-localization). Scope: full on-page and technical review of the code —
titles, schema, canonicals, crawl surface, AEO layer. **Not** covered (no
network access from the audit environment): live rankings, backlinks,
Search Console data, real-world Core Web Vitals.

## What's already strong (keep)

- **Every page has a unique title, meta description, and self-referencing
  canonical.** Titles follow a consistent `Topic · Flint Digital` pattern
  at healthy lengths.
- **Full social card coverage** — og:title/description/url/image +
  twitter:card on all six pages, correct per-page og:url.
- **Structured data is layered properly:** ProfessionalService + founder
  Person on the homepage, FAQPage with all 10 Q&As on the FAQ,
  BreadcrumbList on every subpage.
- **AEO foundation in place:** llms.txt with services, pricing, and key
  pages (kept in sync with the August pricing change); FAQ answers written
  in citable, self-contained language.
- **Technical hygiene:** `lang="en"`, robots.txt + sitemap, font preload on
  every page, self-hosted fonts, hand-coded static HTML with text-based
  LCP (no render-blocking hero image), one properly alt-texted image.

## Findings

### 1. The schema has no contact identity (P0)
The ProfessionalService block carries no `telephone`, no `email`, and —
since the de-localization removed `areaServed` — no geographic signal of
any kind. The footer publishes (913) 735-1163 and info@flintdigital.ai on
every page; the schema should assert the same NAP so search engines and AI
assistants can tie the entity together. `sameAs` is still a placeholder
pointing at the site itself, with a TODO for Google Business Profile,
LinkedIn, and Facebook.

**Fix:** add `telephone` and `email` to the schema now. `sameAs` and GBP
still require the real profile URLs (client input — same TODO as before).

### 2. No geographic target = no rankable market (P0 — strategic, client call)
Removing Kansas City was a branding decision; the SEO consequence is that
the site now targets "digital agency for small businesses" **nationally**,
one of the most competitive phrases on the internet, with a brand-new
domain and no backlinks. Realistic paths:

- **Quiet local:** keep the national copy but restore geographic relevance
  invisibly — `areaServed` in schema, a Google Business Profile with a
  service area, local citations. Ranks locally without "Kansas City" ever
  appearing on the page.
- **Vertical instead of geo:** lean into the niches already on the site
  (self-storage, florists, event centers) with dedicated landing pages —
  "websites for self-storage facilities" is winnable; "websites for small
  business" is not.
- **Genuine national brand play:** accept that organic traffic will come
  from content (Insights) and referrals, not head terms.

This is a positioning decision only the client can make; the site currently
sits in the weakest spot (national head terms, no content moat).

### 3. Insights is orphaned but still indexable (P1)
It was unlinked from footers/sitemap/llms.txt (by design, until content
exists), but the page still has a canonical, no `noindex`, and may already
be in Google's index from before. An indexed orphan whose content is three
"coming soon" stubs is crawl junk.

**Fix:** add `<meta name="robots" content="noindex">` to insights.html
until real posts ship — then remove it and relink everywhere at once.

### 4. Sitemap lastmod is stale (P1)
All five URLs say `2026-07-15`; the site has changed substantially since
(hero, pricing, photos, copy). Stale lastmod teaches crawlers to distrust
the sitemap. **Fix:** bump lastmod on edited pages, and keep doing so.

### 5. Homepage h1 carries zero keywords (P2 — accepted tradeoff)
"Stop losing customers to worse competitors." converts; it just doesn't
rank. The title tag and eyebrow carry the keywords, which is a defensible
split — noted so it's a choice, not an oversight. Same on Work ("Built
these ourselves. Real results.").

### 6. About page is missing its Person schema (P2)
The homepage declares Chris as founder, but about.html — the E-E-A-T page —
only has breadcrumbs. A ProfilePage/Person block (name, jobTitle, image,
worksFor → Flint Digital, sameAs → LinkedIn when available) strengthens the
entity graph AI assistants use.

### 7. No caching headers or 404 page (P2)
netlify.toml sets no `[[headers]]` — fonts/CSS/JS/images get default
caching rather than long-lived immutable caching. There's also no 404.html,
so Netlify serves its generic 404. Neither hurts rankings directly; both
are cheap wins.

### 8. Internal linking is footer-heavy (P2)
How It Works and FAQ — the highest-intent support pages — are reachable
only from the footer (same finding as the design audit's nav item). Adding
them to the top nav strengthens both UX and crawl priority.

## Suggested order

1. Schema NAP (+ About Person schema) — no client input needed
2. noindex on Insights, sitemap lastmod refresh — no client input needed
3. Caching headers + 404 page — no client input needed
4. Geographic/vertical strategy decision — client call, then implement
5. sameAs / GBP — needs real profile URLs
6. Content: first Insights post(s), then relink + de-noindex
