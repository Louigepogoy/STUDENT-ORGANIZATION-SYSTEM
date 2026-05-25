# Agent instructions for Student Organization System

This repository is a two-part full-stack app:
- `backend/` — Laravel 9 API with Sanctum authentication
- `frontend/` — Next.js 15 App Router UI with TypeScript and Tailwind CSS

## Primary guidance

- Use `README.md` at the repo root as the canonical setup and feature guide.
- Prefer changes that keep backend API behavior aligned with existing frontend expectations.
- For frontend-specific agent behavior, consult `frontend/AGENTS.md` and `frontend/CLAUDE.md`.

## Local development

1. Backend:
   - `cd backend`
   - `composer install`
   - `php artisan key:generate`
   - `php artisan migrate:fresh --seed`
   - `php artisan serve`
   - API base: `http://127.0.0.1:8000/api`

2. Frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
   - Ensure `frontend/.env.local` contains `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api`

## What matters most

- Backend routes and controllers are in `backend/routes/api.php` and `backend/app/Http/Controllers/`.
- Backend models are in `backend/app/Models/`.
- Frontend pages and client UI are in `frontend/src/app/`.
- Frontend API helpers are in `frontend/src/lib/api.ts`.
- Auth state and user roles are important: student, officer, admin.

## Common development notes

- The frontend depends on the Laravel API running first.
- Default backend storage is SQLite; switching to MySQL requires editing `backend/.env`.
- API error messages and auth guard behavior are used directly by the frontend.

## Useful references

- Root setup/history: `README.md`
- Frontend Next.js conventions: `frontend/README.md`
- Frontend agent hints: `frontend/AGENTS.md`, `frontend/CLAUDE.md`
