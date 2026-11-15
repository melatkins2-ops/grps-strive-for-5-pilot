# GRPS Attendance Playbook — Interactive (Strive for Less Than 5)

The GRPS Attendance Playbook made interactive and easier to use. It's a static site published with GitHub Pages and has no build step.

**Live:** https://melatkins2-ops.github.io/grps-strive-for-5-pilot/

## What's in it

| Area | What it does |
|---|---|
| **Home** | A "How many days has a scholar missed?" counter. It shows the Playbook category, the GRPS tier and what to do next, and projects the year-end total when you're partway through the year. It also has three doorways (Support, Team, Families) and the seven Playbook chapters. |
| **Playbook** | All seven chapters, each with page references and a link to the original PDF. Every "Read more" link is included. Interactive pieces: days calculator, misleading-metrics check, root causes, five universal strategies, MTSS explorer, stay-home checker, family event planner, Synergy report finder, root-cause sorter, interventions by reason, action-vs-intervention quiz, team-building steps, and a searchable list of every link. |
| **Support** | A guided five-step flow to a matched plan. **My plans** tracks Day 10/20/30 reviews counted in school days. **Practice cases** has 12 scenarios. |
| **Team Room** | A timed meeting agenda (from the Toolkit) and the Strive for 5 grade-level challenge. It also has an "on the cusp" list, a school data dashboard (from a CSV export), the April 2026 escalation framework, and scripts and handouts. |
| **Families** | "Should my child go to school today?" from the Playbook's symptom list, plus why every day counts, tips and where to get help, in English and Spanish. |
| **Search** | The plain-language attendance search engine, plus matching Playbook sections and links. |

## Absence levels
- **Tiers** follow the GRPS Attendance Support & Escalation Framework (April 2026): Tier 1 is 0–9%, Tier 2 is 10–19% and Tier 3 is 20% or more.
- **Category names** follow the Playbook: Satisfactory (under 5%), At risk (5–9.9%), Moderate chronic (10–19.9%) and Severe chronic (20% or more).

## Privacy
Plans, reading progress and the language choice are stored only in the browser on that device. Uploaded data files are read in the browser and never sent or saved anywhere. Use local IDs, never scholar names.

## Files
- `index.html` — page shell
- `css/app.css` — styles
- `fonts/` — Oswald and Barlow (OFL), self-hosted
- `js/engine.js` — search engine, resources, intervention map, scenarios
- `js/playbook.js` — Playbook chapters, links, interactive pieces, Families, Team Room
- `js/app.js` — routing, guided flow, plans, data dashboard
- `attendance_qa_v2.html` — regression runner (25 scenarios)
- `Strive_for_Less_Than_5_Playbook.pdf` — the original Playbook
- `tools/` — templates and guides

## QA
Open `attendance_qa_v2.html` and run the test set. All 25 scenarios should pass.
