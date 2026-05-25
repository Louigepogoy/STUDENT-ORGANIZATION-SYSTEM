# Student Organization System

A full-stack campus system for managing student organizations, memberships, events, and announcements.

- **Backend:** Laravel 9 (REST API + Sanctum auth)
- **Frontend:** Next.js 15 (App Router + Tailwind CSS)

## Features

- User registration and login (students & admins)
- Rich organization profiles (mission, vision, objectives, requirements, adviser, contacts)
- Educational **About** page explaining student orgs in school
- Browse and search organizations
- Apply to join organizations (pending → approved workflow)
- **Officer panel:** approve/reject applications, create events & announcements
- **Admin panel:** create, edit, and delete organizations
- View upcoming events and announcements
- Personal dashboard with membership status

## Demo accounts

| Role    | Email               | Password  |
|---------|---------------------|-----------|
| Admin   | admin@school.edu    | password  |
| Student | student@school.edu  | password  |
| Officer | officer@school.edu  | password  |

## Requirements

- PHP 8.0+ with extensions: sqlite, mbstring, openssl, tokenizer, xml, ctype, json
- Composer
- Node.js 18+

## Quick start

### 1. Backend (Laravel)

```bash
cd backend
composer install
php artisan key:generate
# SQLite is configured by default (database/database.sqlite)
php artisan migrate:fresh --seed
php artisan serve
```

API runs at: `http://127.0.0.1:8000/api`

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:3000`

Ensure `frontend/.env.local` contains:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

## Using MySQL instead of SQLite

Edit `backend/.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=student_org
DB_USERNAME=root
DB_PASSWORD=
```

Create the database, then run `php artisan migrate:fresh --seed`.

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register |
| POST | `/api/login` | Login |
| GET | `/api/organizations` | List orgs |
| GET | `/api/organizations/{id}` | Org detail |
| POST | `/api/organizations/{id}/join` | Apply (auth) |
| GET | `/api/events` | List events |
| GET | `/api/announcements` | List announcements |
| GET | `/api/me` | Current user (auth) |
| GET | `/api/my-memberships` | My memberships (auth) |
| GET | `/api/organizations/{id}/memberships/pending` | Pending apps (officer) |
| PATCH | `/api/memberships/{id}` | Approve/reject (officer) |
| POST | `/api/events` | Create event (officer) |
| POST | `/api/announcements` | Create announcement (officer) |
| POST/PUT/DELETE | `/api/organizations` | Manage orgs (admin) |

Protected routes require header: `Authorization: Bearer {token}`

### Officer workflow

1. Log in as `officer@school.edu`
2. Open an organization you preside over
3. Use the **Officer Panel** to approve members, post events, and announcements

### Admin workflow

1. Log in as `admin@school.edu`
2. Go to **Admin** in the nav or Dashboard → Manage organizations

## Project structure

```
student organization system/
├── backend/          # Laravel API
└── frontend/         # Next.js UI
```
