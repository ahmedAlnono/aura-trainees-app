# AURA Remote Work — Trainee Manager

A React app for the Encodec AURA pilot program: add, edit, delete and showcase
trainee profile cards. Data persists in the browser (localStorage), with
JSON export/import for backups or sharing.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Features

- **Trainee cards** with: name, from / living in, English level (A1–C2 bar),
  communication level (1–10 bar), skills pills, short intro, work experience,
  email / phone / LinkedIn / GitHub / portfolio, and a **QR code** that scans
  to any link you enter (e.g. their LinkedIn).
- **Add / edit / delete** trainees via a form (modal).
- **Search** by name, country, skill; **filter** by status
  (In Training / Interviewing / Hired).
- **Dashboard stats**: total, interviewing, hired.
- **Export / Import** the full list as JSON.
- Seeded with the 6 pilot trainees from the presentation.

## Project structure

```
src/
  App.jsx                  – main screen, state, search/filter, export/import
  data.js                  – storage helpers, levels, statuses, seed data
  components/
    TraineeCard.jsx        – profile card with QRCodeSVG
    TraineeForm.jsx        – add/edit form
  styles.css               – AURA cream/brown theme
```

## Deploy

`npm run build` produces a static site in `dist/` you can host anywhere
(Vercel, Netlify, GitHub Pages…).
