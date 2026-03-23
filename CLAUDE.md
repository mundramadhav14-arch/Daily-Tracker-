# Daily Tracker Project Guide

## Purpose
This project is a habit-tracking Progressive Web App for personal daily scoring.

## Product Rules
- Each habit is tracked as `Yes` or `No`.
- `Yes` contributes `1` point.
- `No` contributes `0` points.
- Daily score is always calculated against the full habit list.
- Weekly and monthly trends aggregate historical daily scores.

## Architecture
- `src/data/` holds static tracker definitions and app constants.
- `src/lib/` holds pure scoring, grouping, and date utilities.
- `src/components/` holds presentational React components.
- `src/DailyTrackerApp.jsx` composes the page and state flow.

## State Rules
- Entries persist in browser `localStorage`.
- The app should remain usable offline after first load.
- New tracker items should be added in a single source of truth, not duplicated across components.

## UI Rules
- Preserve a calm, premium mobile-first look.
- Prefer readable trend summaries over dense controls.
- Keep the scoring dashboard easy to scan at a glance.

## Next Extensions
- Cloud sync
- export / backup
- reminders
- numeric metrics for water or step counts if needed later
