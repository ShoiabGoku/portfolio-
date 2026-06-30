# Shoiab Akhtar — Aerospace Portfolio

A premium, dark-mode personal portfolio for an **M.Tech Aerospace Engineering** student at **IIT Bombay**, focused on hypersonics, aerothermodynamics, heat transfer and CFD.

**Live (once Pages is enabled):** `https://shoiabgoku.github.io/portfolio/`

Hand-built, framework-free, fast. A hand-rolled canvas **3D wireframe re-entry capsule**, particle field, animated **skills radar**, and click-through **project case studies** — no Three.js, no React, no build step.

---

## 1 · Tech stack & rationale

| Layer | Choice | Why |
|---|---|---|
| Markup | Semantic HTML5 | Accessibility + SEO |
| Styling | Hand-written CSS (custom properties) | Full control, zero framework weight |
| Logic / visuals | Vanilla JS (ES5-safe) | No bundler; runs anywhere, instantly |
| 3D / particles | Custom Canvas 2D engine | ~0 KB deps vs ~600 KB Three.js — Lighthouse-friendly |
| Fonts | Space Grotesk · Inter · JetBrains Mono (Google Fonts) | Premium type; graceful system fallback |
| Hosting | GitHub Pages | Free, fast, matches existing workflow |

> **Why not Next.js/React?** The brief listed it as a *preference*. For a static, single-author site deployed to GitHub Pages — with no Node toolchain on the author's machine — a dependency-light static build is faster to load, trivial to deploy, works offline, and is a stronger engineering signal. The structure below maps 1:1 onto a Next.js migration later if desired.

---

## 2 · UX case study (short form)

**Problem.** Recruiters and admissions committees at NASA / ISRO / DRDO / SpaceX scan a portfolio in seconds. It must communicate *technical depth + research capability + design maturity* immediately, without clutter.

**Audience.** (1) Research-group PIs & PhD admissions, (2) aerospace R&D hiring managers, (3) collaborators.

**Principles.**
- **Signal over noise** — every animation reinforces the aerospace story (shock layer, re-entry capsule, skills radar); nothing is decorative-only.
- **Progressive depth** — skim the hero → scan sections → open a project for the full engineering case study (objective → methodology → results → lessons → future).
- **Calm, premium, dark** — deep-space background, restrained accents, generous spacing, one orange highlight reserved for "hot" emphasis (heat flux, résumé).
- **Performance is a feature** — no framework, lazy reveal, reduced-motion support.

**Outcome.** A single-scroll narrative that ends on a clear call to action (email + résumé).

---

## 3 · Site map

```
/  (single page)
├─ Hero ........... identity, value prop, CTAs, 3D capsule
├─ Marquee ........ focus-area ticker
├─ About ......... story, why aerospace, vision, trajectory timeline
├─ Skills ........ 7-domain radar + capability cards
├─ Projects ...... 6 cards → modal case studies
├─ Thesis ........ dedicated: motivation→method→chemistry, diagrams
├─ Research ...... interests, current, future, collab, publications, posters
├─ Experience .... research/lab/leadership/sports/hostel/volunteer timeline
├─ Achievements .. awards/scholarships/competitions/… cards
├─ Gallery ....... lab/CFD/wind-tunnel/campus tiles
├─ Contact ....... email, GitHub, LinkedIn, Scholar, ResearchGate, résumé
└─ Footer
```

## 4 · User flow

```
Land → read hero value prop → [primary] View Research ─┐
                              [secondary] Projects ───┼→ open case-study modal → email / résumé
                              [tertiary] Résumé / Contact ─┘
Scroll path: About → Skills → Projects → Thesis → Research → Experience → Achievements → Gallery → Contact
Nav + scroll-spy let users jump directly; mobile collapses to a slide-in menu.
```

---

## 5 · Color system (design tokens)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#050816` | Page background (deep space) |
| `--blue` | `#3B82F6` | Accent / aerospace blue |
| `--cyan` | `#38BDF8` | Primary accent (plasma) |
| `--titanium` | `#94A3B8` | Secondary text / structure |
| `--white` | `#F8FAFC` | Primary text |
| `--orange` | `#FB923C` | **Highlights only** (heat flux, résumé) |

Gradients: `--grad-plasma` (cyan→blue→violet) for identity; `--grad-thermal` (cyan→blue→orange) for thermal/shock motifs.

## 6 · Typography system

| Role | Family | Notes |
|---|---|---|
| Display / headings | **Space Grotesk** | Tight tracking, technical-premium |
| Body | **Inter** | High legibility at small sizes |
| Mono / labels / data | **JetBrains Mono** | Eyebrows, HUD tags, code |

Headings use a fluid `clamp()` scale; line-height 1.65 for body comfort.

## 7 · Component library

Defined in [`assets/css/style.css`](assets/css/style.css): buttons (`.btn`, `.btn-primary/ghost/amber`, `.magnetic`), glass panels (`.glass`), nav + scroll-spy, eyebrows/section heads, timelines (`.tl`, `.xp`), skill radar + cards (`.pips`), project cards + modal, thesis band + SVG diagrams, chemistry ladder, research/achievement cards, gallery tiles, contact links, footer, reveal utilities (`.reveal .d1–.d6`).

## 8 · Responsive layouts

Breakpoints: **≤1040px** (tablet — 2-col grids, stacked hero), **≤760px** (mobile — single column, slide-in nav), **≤430px** (compact). Verified no horizontal overflow at 375 / 768 / 1280px.

---

## 9 · Deployment instructions

This repo **is** the site (no build step).

1. Push to GitHub (already done if you're reading this on GitHub).
2. **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `root` → Save.**
   *(GitHub Pages can't be toggled programmatically — this one-time step is yours.)*
3. Wait ~1–2 min; the site is live at `https://shoiabgoku.github.io/portfolio/`.

`.nojekyll` is included so asset paths are served verbatim.

**To update:** edit files → `git add -A && git commit -m "update" && git push` → Pages redeploys automatically.

---

## 10 · ✅ Fill these in (placeholders ready in the markup)

- [ ] **Résumé** — drop `resume.pdf` into `assets/` (every "Résumé" button points to `assets/resume.pdf`).
- [ ] **LinkedIn / Google Scholar / ResearchGate URLs** — in the Contact section.
- [ ] **Undergraduate (B.Tech)** institution + years — About timeline.
- [ ] **Experience** — real dates, labs, organisations, outcomes (template rows in place).
- [ ] **Achievements** — real awards, scholarships, GATE rank, certifications.
- [ ] **Gallery** — add images to `assets/gallery/` and swap the placeholder SVG tiles.
- [ ] **Publications / posters** — add as they appear.
- [ ] Confirm surname spelling ("Shoiab Akhtar") and verify thesis details.

> Nothing fabricated: career credentials are left as clearly-marked, editable placeholders so the portfolio stays truthful.

---

## 11 · Future improvements

- Real OG/Twitter share image (`assets/og.png`) for link previews.
- Optional Next.js + TypeScript migration if a CMS/blog is wanted.
- Interactive thesis figures (live shock-standoff / heat-flux plots from the calculator engine).
- Light-mode variant; i18n (the author speaks 5 languages).
- Blog / notes section for research write-ups.

---

## File structure

```
portfolio/
├─ index.html              # all content + structure
├─ assets/
│  ├─ css/style.css        # design system + components
│  ├─ js/app.js            # interactions, 3D capsule, radar, modals
│  ├─ resume.pdf           # ← add this
│  └─ gallery/             # ← add images
├─ .nojekyll
└─ README.md
```

© Shoiab Akhtar · Aerospace Engineer — Hypersonics & CFD · M.Tech, IIT Bombay
