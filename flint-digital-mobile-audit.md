# Flint Digital — Mobile Design Audit

Audited 2026-09-05 against `main`. Method: all six pages rendered
full-page at 390px and overflow-checked at 320px; interactive states
exercised (hamburger menu open, audit form, anchor navigation);
programmatic checks for overflow and tap-target size.

## Fixed during this audit (merged in 5054f3a + 6e3fc2c)

1. **Hero metric cards now sit 3-across on phones.** Days / 40–60% /
   Page 1 were stacking as full-width cards; they're now one compact row
   (16px numbers, 11px labels, 20px icons). Verified single-row with no
   overflow at 390px and 320px. Bonus: the entire hero — eyebrow,
   headline, both CTAs, metric row — now fits one phone viewport.
2. **Anchor links no longer land under the fixed nav.** There was no
   `scroll-padding-top` anywhere, so tapping "Free Audit" (or any #anchor)
   buried the section top beneath the nav bar. Now 84px desktop / 72px
   mobile; `#cta` verified landing fully visible.
3. **iOS zoom-on-focus fixed.** Form inputs were 14px; iOS Safari zooms
   the viewport on focus for anything under 16px and doesn't zoom back.
   Inputs and the select are 16px under 900px.
4. **Hero height uses `100svh`** (with `100vh` fallback) so mobile
   browser toolbars no longer cause the hero to overshoot the visible
   viewport.

Also in this pass (separate request): hero eyebrow line 1 is now
"Kansas City based, AI-first digital agency." — wraps to two tidy lines
on mobile.

## Verified healthy — no action needed

- **Zero horizontal overflow** on any page at 390px or 320px.
- **Zero undersized tap targets:** menu links 62px tall, form fields
  46–48px, buttons 48px, hamburger 44px.
- **The mobile menu works well:** full-width links, hamburger animates to
  an X, Free Audit CTA + tappable phone number included, body scroll
  locked while open, Escape closes it.
- Reduced-motion support, visible focus states, and skip links present on
  every page; viewport meta on all seven HTML files (404 included).
- Page heights are reasonable after the September typography scaling
  (about 4.7k, faq 2.5k, insights 3.0k, work/how ~5.8k).

## Open observations (small, optional)

5. **Menu doesn't close on outside tap.** It covers only the top half of
   the screen; tapping the visible page below it does nothing (only the
   X, Escape, or a link closes it). Adding tap-outside-to-close matches
   what thumbs expect.
6. **How It Works and FAQ still absent from the mobile menu** — the menu
   has room for six links; these are the two highest-intent pages. (Third
   audit in a row to flag this; it remains a one-line change per page.)
7. **Homepage is still ~9.7k px on mobile** — now structural, not
   typographic: six portfolio cards, fifteen audience tags, and four
   pricing cards stacking single-file. If it should be shorter, the
   levers are showing three portfolio cards with a "See all work" link
   and/or capping the tag cloud on phones.
