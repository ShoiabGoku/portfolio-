# Shoiab Akhtar — Aerospace Portfolio

A premium, dark-mode personal portfolio for an **M.Tech Aerospace Engineering** student at **IIT Bombay**, focused on hypersonics, aerothermodynamics, heat transfer and CFD.

**Live (once Pages is enabled):** `https://shoiabgoku.github.io/portfolio-/`

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
├─ Projects ...... 14 cards → modal case studies
├─ Thesis ........ motivation→method→chemistry + real CFD results gallery
├─ Research ...... interests, current, future, collabs, publication, talks
├─ Experience .... research/lab/leadership/sports/hostel/volunteer timeline
├─ Achievements .. awards/scholarships/competitions/… cards
├─ Contact ....... email, GitHub, LinkedIn, publication DOI, live tools, résumé
└─ Footer
```

## 4 · User flow

```
Land → read hero value prop → [primary] View Research ─┐
                              [secondary] Projects ───┼→ open case-study modal → email / résumé
                              [tertiary] Résumé / Contact ─┘
Scroll path: About → Skills → Projects → Thesis → Research → Experience → Achievements → Contact
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

Defined in [`assets/css/style.css`](assets/css/style.css): buttons (`.btn`, `.btn-primary/ghost/amber`, `.magnetic`), glass panels (`.glass`), nav + scroll-spy, eyebrows/section heads, timelines (`.tl`, `.xp`), skill radar + cards (`.pips`), project cards + modal, thesis band + SVG diagrams, chemistry ladder, research/achievement cards, CFD gallery + lightbox, contact links, footer, reveal utilities (`.reveal .d1–.d6`).

## 8 · Responsive layouts

Breakpoints: **≤1040px** (tablet — 2-col grids, stacked hero), **≤760px** (mobile — single column, slide-in nav), **≤430px** (compact). Verified no horizontal overflow at 375 / 768 / 1280px.

---

## 9 · Deployment instructions

This repo **is** the site (no build step).

1. Push to GitHub (already done if you're reading this on GitHub).
2. **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `root` → Save.**
   *(GitHub Pages can't be toggled programmatically — this one-time step is yours.)*
3. Wait ~1–2 min; the site is live at `https://shoiabgoku.github.io/portfolio-/`.

`.nojekyll` is included so asset paths are served verbatim.

**To update:** edit files → `git add -A && git commit -m "update" && git push` → Pages redeploys automatically.

---

## 10 · Content status

Done (real data from résumé + publication):
- [x] **Résumé** — purpose-built **web résumé** at `resume.html` (dark on screen, clean black-on-white on print/Save-as-PDF, **no phone number**); every "Résumé" button links to it.
- [x] **B.Tech** — Hindustan Institute of Technology & Science (HITS), Chennai · 2021–2025 · CGPA 8.5.
- [x] **Experience** — IIT Gandhinagar & IIT Bhubaneswar research internships, Lab Coordinator, AICTE Bootcamp team lead.
- [x] **Achievements** — AICTE (PM-USP) & HITS merit scholarships, academic record, certifications, olympiad.
- [x] **Publication** — first-author Elsevier book chapter, DOI + `assets/publications/banana-fibers-composites.pdf`.
- [x] **B.Tech projects** — Gulfstream G650 design, high-compression fuel injector, model rocket.
- [x] **Languages** — English, Hindi, Ladakhi, Urdu, Arabic.

- [x] **CFD results** — 10 real ANSYS Fluent contours in the Thesis section (`assets/mtp/`), click-to-enlarge.
- [x] **LinkedIn** — real profile URL wired in.
- [x] **Zero placeholders** — every section now shows real content only (the fake photo gallery was removed rather than shipped with dummy tiles).

Optional future additions:
- [ ] **Google Scholar / ResearchGate** — create the profiles, then add links (Contact currently links the Elsevier DOI instead).
- [ ] **Real photos** (lab / wind tunnel / campus) — if added, a photo gallery section can be rebuilt.
- [ ] **Posters / talks** — add as they appear.

> Nothing fabricated: every credential is drawn from the author's own résumé, published chapter and CFD work.

---

## 11 · Future improvements

- Optional Next.js + TypeScript migration if a CMS/blog is wanted.
- Interactive thesis figures (live shock-standoff / heat-flux plots from the calculator engine).
- Light-mode variant; i18n (the author speaks 5 languages).
- Blog / notes section for research write-ups.

---

## File structure

```
portfolio/
├─ index.html              # all content + structure
├─ resume.html             # web résumé (screen + print/PDF), no phone
├─ assets/
│  ├─ css/style.css        # design system + components
│  ├─ js/app.js            # interactions, 3D capsule, radar, modals
│  ├─ mtp/                 # ✓ CFD result contours (WebP)
│  ├─ publications/        # ✓ Elsevier chapter PDF
│  ├─ reports/             # ✓ cryogenics report PDF
│  └─ og.png               # ✓ social share card
├─ .nojekyll
└─ README.md
```

© Shoiab Akhtar · Aerospace Engineer — Hypersonics & CFD · M.Tech, IIT Bombay
