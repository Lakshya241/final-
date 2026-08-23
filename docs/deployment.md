# Deployment Guide

This project has two deployable applications:

- `frontend`: React and Vite, deployed to Vercel
- `backend`: Laravel API, deployed to Render Free

The free Render service sleeps after inactivity. The first request after sleep can take a little longer. Use a hosted PostgreSQL database for persistent data; do not use SQLite on Render because its local filesystem is ephemeral.

## 1. Prepare the Backend

Push the repository to GitHub, then create a free PostgreSQL database on [Neon](https://neon.tech) or another PostgreSQL provider. Keep the database connection values available:

- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`

The database must support SSL if the provider requires it. For Laravel, set `DB_SSLMODE=require` when required by the provider.

## 2. Deploy Laravel on Render Free

In Render, create **New > Web Service**, select the GitHub repository, and use:

- **Root Directory:** `backend`
- **Runtime:** Docker
- **Dockerfile Path:** `backend/Dockerfile` (or `Dockerfile` if the root directory is set to `backend`)

The included [backend/Dockerfile](../backend/Dockerfile) installs PHP, PostgreSQL support, Composer dependencies, migrations, and the Laravel server. Render supplies the `PORT` environment variable to the container.

Add these environment variables in Render. Replace the values with the real database and frontend values:

```text
APP_NAME=AURA
APP_ENV=production
APP_DEBUG=false
APP_KEY=<generate-a-local-key-with-php-artisan-key:generate>
APP_URL=https://your-backend.onrender.com

DB_CONNECTION=pgsql
DB_HOST=<neon-host>
DB_PORT=5432
DB_DATABASE=<database-name>
DB_USERNAME=<database-user>
DB_PASSWORD=<database-password>
DB_SSLMODE=require

CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

Generate `APP_KEY` locally from the `backend` directory and copy the value from `.env` into Render. Never commit the key to GitHub.

After deployment, test:

```text
https://your-backend.onrender.com/api/products
```

It should return JSON product data. The public API routes are documented in [api.md](api.md).

## 3. Deploy the Frontend on Vercel

In Vercel, choose **Add New > Project**, import the same GitHub repository, and set:

- **Root Directory:** `frontend`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

Add this Vercel environment variable:

```text
VITE_API_URL=https://your-backend.onrender.com/api
```

Deploy the project. Vercel will provide a URL such as:

```text
https://your-frontend.vercel.app
```

The `VITE_API_URL` value is embedded at build time. Redeploy the frontend after changing it.

## 4. Finish CORS Configuration

Copy the final Vercel domain into the Render variable:

```text
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

If you also use a Vercel preview domain, separate origins with commas:

```text
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-preview-domain.vercel.app
```

Then redeploy or restart the Render service. Do not use `*` in production when restricting access to a known frontend.

## Local Development

Run the backend in one terminal:

```powershell
cd backend
php artisan serve --host=127.0.0.1 --port=8000
```

Run the frontend in a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

For local development, the frontend falls back to `http://127.0.0.1:8000/api` when `VITE_API_URL` is not set.

## Deployment Verification

1. Open the backend `/api/products` URL and confirm it returns JSON.
2. Open the Vercel frontend and confirm the collection loads.
3. Open `/admin/products` and confirm products load from the API.
4. Create a test product or order, then refresh and confirm the data persists.
5. Check the browser console for CORS or failed network requests.

## Important Notes

- Free Render services sleep when idle and have limited resources.
- Render's local filesystem is not persistent, so PostgreSQL is recommended instead of SQLite.
- Set `APP_DEBUG=false` in production.
- Keep `APP_KEY`, database passwords, and provider connection strings in platform environment variables only.
