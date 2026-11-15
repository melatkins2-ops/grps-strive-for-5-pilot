# Strive for Less Than 5 — Attendance Guide (Pilot)

GRPS attendance guide for matching support to the reason a scholar is missing school. It's a static site published with GitHub Pages and has no build step.

**Live:** https://melatkins2-ops.github.io/grps-strive-for-5-pilot/

## What's in it

| View | What it does |
|---|---|
| **Home** | Choose a role once. Home then shows that role's most common next steps, upcoming reviews, and a first resource. |
| **Support a scholar** | Guided five-step flow: attendance level → root cause → specific need → details → matched plan. Each plan can be downloaded, printed, or saved as a case. |
| **Cases** | Case tracker with Day 10/20/30 reviews counted in school days (weekends skipped). Each review records delivery, barrier change, and attendance %, and the tracker suggests a decision. Supports CSV and JSON export and import. |
| **School data** | Upload or paste an attendance export. Columns are detected automatically. Shows tiers, chronic absence rate, the fewer-than-5-days count, and breakdowns by grade, school, or group. The follow-up list has a **Start a case** button on each row. |
| **Library** | Plain-language search across all resources (the original engine). |
| **Practice** | Twelve role-based scenarios. A scenario can be loaded into the guided flow. |
| **Team** | Workflow, tiers and ownership, root causes, 10/20/30 decisions, families, community partners, downloads. |

## Privacy
- Cases and the chosen role are stored only in the browser on that device (`localStorage`).
- Uploaded data files are read in the browser and never sent or saved anywhere.
- Use local IDs or initials, never scholar names.

## Files
- `index.html` — page shell
- `css/app.css` — styles
- `js/engine.js` — content and search engine (resources, tiers, intervention map, scenarios)
- `js/app.js` — app layer: routing, guided flow, case tracker, data dashboard
- `attendance_qa_v2.html` — regression runner (25 scenarios)
- `tools/` — templates and guides
- `Strive_for_Less_Than_5_Playbook.pdf` — the Playbook

## QA
Open `attendance_qa_v2.html` and run the test set. All 25 scenarios should pass.
