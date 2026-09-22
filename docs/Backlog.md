# Product Backlog & Status
## BH25 Creative Portfolio — Scrum Master

**Owner:** Scrum Master  
**PRD:** `docs/PRD.md` (PM, 16 Sep 2026) — IA source of truth  
**Last updated:** 16 September 2026  

This file is the living memory. Update it when product decisions change. Do not implement dropped stories.

---

## Now / Next / Later

| Horizon | What |
|---|---|
| **Now** | `/resume`: interactive skills + experience. Education off the page. PDF later (S17). |
| **Next** | Hero / landing animation and an interactive “fun toy” (S16). |
| **Later** | Portfolio grid, performance/a11y/deploy, optional Three.js / blog / dashboard / nav. |

---

## Current product (memory)

**Shipped (session + prior foundation)**

- Next.js 15 App Router, TypeScript, Tailwind, GSAP, theme, cursor, transitions
- Home: ~full-viewport hero; text-only Resume CTA at bottom of first screen → `/resume`
- `/resume`: name, title, summary, location, copy-email, **skills as type list**, experience. Education off the page.
- Global `BackgroundDots` in layout (every page)
- Header: logo + ID card. ID card = trail to footer only (no copy, no mailto)
- Footer: copy-email, LinkedIn, Tennessee outline with Knoxville dot
- `/style-guide` exists (unlisted)
- Utility dashboard **unmounted** (files kept)
- `/contact` **removed**

**Not shipped**

- Portfolio grid (page is a coming-soon stub) — **deferred by PM**
- Resume PDF download
- Hero landing motion + interactive toy (next after resume)
- Three.js backgrounds, blog, contact form, site nav

**Paper vs reality (why this rewrite)**

Old backlog (Dec 2024) marked nav and Sprint 1 complete and queued a contact form. The human then removed nav, rejected the form, and split resume onto its own page. Those stories are recast or dropped below.

---

## Dropped (do not implement)

| Was | Why |
|---|---|
| Story #4 as “nav menu + hamburger” | Human removed primary nav. Header is logo + ID card only. |
| Story #7 Contact form | Human: no form, no `/contact`, no mailto. |
| Header ID card copies email | Human: trail only. Copy stays on footer / resume `CopyEmail`. |
| Utility dashboard in chrome | Unmounted; do not rewire to `/resume` unless asked. |
| Portfolio grid as next story | Human (16 Sep 2026): not important right now. Resume first, then hero craft. |

Keep the routes `/resume` and `/portfolio`. They are destinations, not menu items.

---

## Recast backlog

Story points remain Fibonacci. One-developer team. Implement **one story at a time** (`docs/04_Dev.md`).

### Done (foundation — recast)

**S1. Project setup** — Next.js, TS, Tailwind, lint/format. Done.

**S2. Layout chrome** — Header (logo + ID card), footer (copy email, social, TN map + Knoxville), theme, error/loading. **Not** a nav menu. Done.

**S3. Home hero** — Full first viewport, motion type, tagline, text-only Resume CTA at bottom. Done.

**S4. Contact ritual** — ID card trail + scroll to `#contact`; footer/resume clipboard copy; no email in HTML; no mail app. Done.

**S5. Resume page (v1)** — identity + experience + copy-email. Superseded by S8.

**S6. Global dots** — One layout instance; no per-page duplicates. Done.

---

### Current sprint

**S8. Resume page complete (content)** — DONE (education removed; skills are a short type list, not a role filter)  
- **AC:** Education is not on the page. Featured skills as display type; extra tooling behind More. No “pick a skill to highlight matching roles.” Copy-email unchanged. PDF is **not** in this slice.  
- **Points:** 5  
- **Deps:** S5  

**S16. Hero motion + interactive toy** — NEXT after S8  
- **As a** visitor, **I want** the landing hero to feel animated and playful **so that** the craft shows up before any other page.  
- **AC:** Hero animation pass; one interactive “fun toy” on the landing (details with the human — do not invent a second page). Resume CTA stays text-only at the bottom of the first viewport.  
- **Points:** 8  
- **Deps:** S3, S8  

---

### Later

**S7. Portfolio grid** — deferred; not current. Original AC still valid when we pick it up. Points: 8.

**S9. Portfolio discovery without nav** — after S7. Points: 2.

**S17. Resume PDF** — downloadable ATS-friendly export. Points: 3. Deps: S8.

**S10. Performance & a11y pass** — Lighthouse > 90, WCAG AA, reduced motion, SEO meta. Points: 5.

**S11. Deploy** — Vercel, domain, env, analytics. Points: 3.

**S12. Three.js (optional)** — Subtle 3D, perf budget, fallback. Points: 8.

**S13. Blog/notes (optional).** Points: 8.

**S14. Dashboard remount (optional)** — Only if hooked to current resume page, not homepage-era assumptions. Points: 5.

**S15. Nav revisit (optional)** — Only if the human asks. Restore existing Header patterns; do not invent a new system. Points: 3.

---

## Definition of done

- Matches current PRD (especially §4 locked decisions)
- Works on desktop and a mobile viewport
- No email plaintext / mailto in HTML
- Header ID card still trail-only
- Dashboard still unmounted unless the story is S14
- This backlog status line updated

---

## SM operating notes

1. After a product decision in chat, update **PRD §4** (PM) and **this status** (SM) in the same change.  
2. Dev starts from **S8** (resume page), then **S16** (hero toy). Not S7.  
3. `docs/Architecture.md` is stale (still has `/contact` and header nav). Do not implement from it until revised.  
4. Prompts: PM `docs/00_PM.md`, Analyst `01`, Architect `02`, this role `03`, Dev `04`, Tester `05`.

---

**Next story for Dev:** S16 — Hero motion + interactive toy.
