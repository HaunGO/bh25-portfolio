# Product Requirements Document (PRD)
## BH25 Creative Portfolio

**Owner:** Project Manager  
**Status:** Living spec (replaces the Analyst-only PRD)  
**Last updated:** 16 September 2026 (priority: resume page, then hero craft; portfolio deferred)  
**Source of truth:** this document. `docs/01_Analyst.md` is the original brief, not current scope.

---

## 1. Overview

A personal site for Brandon Haun: recruiter-facing, motion-led, technically credible. Home is a full-viewport introduction. Resume is a first-class page. Contact is a footer ritual (copy email + cursor trail), not a form and not a page. Primary navigation is intentionally absent.

**Primary goal:** Hireability — skills and experience are easy to find, the craft is visible, contacting is one click without exposing the address to scrapers.

---

## 2. Goals

- Present as a senior frontend / creative developer candidate
- Show craft through motion, typography, and interaction — not through chrome
- Make resume content scannable for humans; keep a path to ATS-friendly export (PDF still required)
- Let someone copy email without a contact form, mailto, or readable address in HTML

**Not goals (explicit):** a marketing-site nav, a contact page, or a message form.

---

## 3. Users

| Priority | Who | Need |
|---|---|---|
| Primary | Recruiters / hiring managers | Fast read on who you are, resume, a way to email |
| Secondary | Potential clients | Work samples and tone |
| Tertiary | Other makers | Craft and implementation details (style guide is internal, not a product surface) |

---

## 4. Product decisions (locked unless reversed)

These override the original Analyst brief.

| Decision | Rule |
|---|---|
| No primary nav | Header is logo (home) + ID-card control. No hamburger, no Resume/Portfolio/Style Guide/Contact menu. Pages may exist at URLs; they are not advertised in a menu. |
| No `/contact` | Route removed. Do not rebuild. |
| No contact form | Do not add name/email/message, API mail, or spam tooling unless the human asks. |
| No mailto / mail app | Header ID card does **not** copy email and does **not** open a mail client. It only plays the cursor trail to the footer and scrolls there. |
| Copy email | Footer (and resume inline control) copies via the existing clipboard helpers. Address is assembled in JS, not shown as plaintext in HTML. |
| Home = hero | First viewport is ~full screen (~90%+). Resume CTA is text-only, pinned to the bottom of that viewport. |
| Dots | Shared background dot grid on every page (layout), not per-page copies. |
| Utility dashboard | Idea kept in code; **not mounted**. Do not rewire to `/resume` unless asked. |
| Tennessee map | Outline in footer; small black dot for Knoxville (east TN). |
| Portfolio is not current | `/portfolio` may stay a stub. Do not prioritize a project grid until resume and hero craft are done. |
| Sequence | Finalize `/resume` first, then hero / landing motion and a playful interactive “toy.” |

---

## 5. Information architecture (current)

```
/                 Home — full-viewport hero, Resume CTA
/resume           Full resume: identity, experience, skills, education (PDF still later)
/portfolio        Exists; coming-soon stub — **deferred**, not the next build
/style-guide      Internal / craft reference — not in chrome
#contact          Footer anchor — trail + copy-email, not a page
```

404 may link to existing routes. That is not a nav system.

**User journeys**

1. Land on hero → read name/tagline → Resume CTA → `/resume`
2. Header ID card → trail down → footer circles contact → copy email from footer control
3. Direct URL or 404 → `/portfolio` (stub; not current work)

---

## 6. In-scope features

### 6.1 Home (after resume)
- Full-viewport hero, animated type, value/tagline — already structurally shipped
- **Next after `/resume`:** landing animation and an interactive “fun toy” (playful craft on the hero; details with the human)
- Text-only Resume control at the bottom of the first screen → `/resume`
- Global dots behind content

### 6.2 Resume (`/resume`) — **current focus**
- Name, title, summary, location
- Copy-email control (same clipboard system as footer)
- Experience, **skills as a short type list** (featured words; extra tooling behind More)
- Skills are not a filter. Do not add “pick a skill to highlight roles.”
- Education is **not on the page** (data may remain for a later PDF)
- ATS-friendly content on-page; downloadable PDF remains a later slice, not a blocker for “page complete”

### 6.3 Portfolio (`/portfolio`)
- **Deferred.** Stub may remain. Grid/case studies are not the current sprint.

### 6.4 Contact (footer, not a page)
- ID-card in header: trail + scroll only
- Footer: copy email, LinkedIn, location / Tennessee outline with Knoxville dot
- Email never in HTML as readable text or `mailto:`

### 6.5 Chrome & craft
- Header (logo + ID card), footer, theme, advanced cursor, page transitions
- Background dots on all routes
- Style guide page may exist for development; it is not a product nav item
- Performance, responsive, WCAG AA, SEO remain requirements

---

## 7. Out of scope (do not build)

- Contact form, `/contact`, mailto
- Primary/global/mobile site navigation
- Mounting the utility dashboard
- Opening the user's mail app from the ID card
- Restoring a “Copied” state on the header ID card

Optional later (not current sprint): Three.js scenes, blog/notes, easter eggs, re-introducing nav if IA grows, remounting dashboard against `/resume`.

---

## 8. Constraints

- Next.js (App Router), React, TypeScript, TailwindCSS v3, GSAP, Three.js available but 3D is optional
- Vercel + custom domain
- Mobile and desktop; `prefers-reduced-motion`
- Resume remains ATS-readable; PDF download still in scope
- Do not put the email address in the document for crawlers

---

## 9. Success metrics

- Lighthouse > 90 when we are in polish/deploy
- WCAG AA
- Recruiter path: home → resume in one click; email copy without seeing the address
- `/resume` shows experience, skills, and education before we call the resume page complete
- Portfolio is not a launch blocker for the current phase
- Motion stays at ~60fps; trail/copy remain separate behaviors

---

## 10. Open questions (PM)

1. When portfolio ships, how do recruiters find it with no nav? (Footer link, home secondary CTA, or accept direct URL only?)
2. Is style guide public or should it stay unlisted?
3. PDF resume: generate from the page, or host a static file?
4. Dashboard: delete later, or keep dormant?

---

**Handoff:** Scrum Master maintains `docs/Backlog.md` against this PRD. Architect (`docs/Architecture.md`) still describes the old sitemap (nav + contact form) — treat this PRD as IA source of truth until Architecture is revised.
