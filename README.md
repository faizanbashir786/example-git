# MTD Readiness Checker (UK)

A lightweight static web tool that guides users through a 5-step flow and produces an MTD readiness report.

## What it includes

- 5-step guided form
- Logic using UK thresholds:
  - £50,000 income → deadline year 2026
  - £30,000 income → deadline year 2027
- Result page with:
  - MTD applicability
  - Deadline year
  - Risk level
  - Digital Gap summary
- Email capture gate before showing full report
- Affiliate placeholders
- Legal disclaimer

## Lightweight stack

- Plain HTML + CSS + vanilla JavaScript
- No build tool required
- Can be hosted as static files

## Run locally

From this folder:

```bash
python3 -m http.server 4173
```

Then open:

- http://localhost:4173

## Deploy options

Because this is static, deploy by uploading `index.html`, `styles.css`, and `app.js` to any static host.

### Option 1: Netlify

1. Create a new site from local files.
2. Drag-and-drop the project folder, or connect this repo.
3. Publish (no build command required, publish directory is project root).

### Option 2: Vercel

1. Import the repo.
2. Use "Other" framework preset.
3. Build command: none.
4. Output directory: `.` (root).

### Option 3: GitHub Pages

1. Push files to a GitHub repo.
2. Enable Pages from branch root.
3. Site will serve static assets directly.

## Notes

- This checker is informational and does not replace professional tax advice.
- For production use, wire the email form to your email platform/CRM and update affiliate links.
