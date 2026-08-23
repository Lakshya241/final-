# AURA — Vercel + Render Deployment Guide

> **Backend** → Render (free Docker service)  
> **Frontend** → Vercel (free Vite/React hosting)

---

## Prerequisites

- A free [Render](https://render.com) account
- A free [Vercel](https://vercel.com) account
- Both accounts connected to the same **GitHub** repository
- Your code pushed to GitHub (instructions below)

---

## Step 0 — Push code to GitHub

If you haven't already:

```bash
# In the project root  (the folder containing backend/ and frontend/)
git init
git add .
git commit -m "initial commit"

# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/aura-jewellery.git
git push -u origin main
```

> Render and Vercel both deploy directly from GitHub — every `git push` auto-redeploys.

---

## Part 1 — Deploy Backend on Render

### 1.1 Create a new Web Service

1. Go to **[dashboard.render.com](https://dashboard.render.com)**
2. Click **New +** → **Web Service**
3. Click **Connect a repository** → select your GitHub repo
4. Click **Connect**

---

### 1.2 Configure the service

| Field | Value |
|-------|-------|
| **Name** | `aura-backend` (or anything you like) |
| **Root Directory** | `backend` |
| **Environment** | **Docker** |
| **Branch** | `main` |
| **Instance Type** | Free |

Render auto-detects the `Dockerfile` inside `backend/`.

---

### 1.3 Add Environment Variables

Scroll down to **Environment Variables** and add these one by one:

| Key | Value |
|-----|-------|
| `APP_NAME` | `AURA` |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_URL` | *(leave blank for now — fill in after first deploy)* |
| `DB_CONNECTION` | `sqlite` |
| `SESSION_DRIVER` | `file` |
| `CACHE_STORE` | `file` |
| `LOG_LEVEL` | `error` |
| `CORS_ALLOWED_ORIGINS` | *(leave blank for now — fill in after Vercel deploy)* |

> **APP_KEY** — the Dockerfile generates it automatically on first boot. No need to set it manually.

---

### 1.4 Deploy

Click **Create Web Service**.

Render will:
1. Pull the repo
2. Build the Docker image (~3–5 min on first deploy)
3. Run migrations and seed the products table
4. Start the Laravel server on port `10000`

When the status shows **Live**, copy the URL — it looks like:

```
https://aura-backend.onrender.com
```

**Paste that URL into the `APP_URL` environment variable** in Render's dashboard, then click **Save** (this triggers a redeploy).

---

## Part 2 — Deploy Frontend on Vercel

### 2.1 Import the project

1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Click **Import Git Repository** → select your GitHub repo
3. Click **Import**

---

### 2.2 Configure the project

| Field | Value |
|-------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

---

### 2.3 Add Environment Variable

Under **Environment Variables** before clicking Deploy:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://aura-backend.onrender.com/api` |

Replace `aura-backend.onrender.com` with your actual Render URL from Step 1.4.

---

### 2.4 Deploy

Click **Deploy**.

Vercel will:
1. Install npm packages
2. Run `npm run build` (Vite bakes `VITE_API_URL` into the bundle)
3. Serve the `dist/` folder globally via CDN

When it shows **Congratulations**, click **Visit** to open the live site.

Your Vercel URL looks like:

```
https://aura-jewellery.vercel.app
```

---

## Part 3 — Wire them together (CORS)

Now that both are live, you need to tell the backend which frontend is allowed.

1. Go back to **Render dashboard** → your `aura-backend` service → **Environment**
2. Set `CORS_ALLOWED_ORIGINS` to your exact Vercel URL **(no trailing slash)**:

   ```
   CORS_ALLOWED_ORIGINS=https://aura-jewellery.vercel.app
   ```

3. Click **Save** — Render will redeploy automatically (~1 min).

---

## Part 4 — Verify everything works

Open your Vercel URL and check:

| Test | Expected |
|------|----------|
| Home page loads | Hero, category banners, product grid visible |
| "Just Landed" shows 4 products | Cards with images and prices |
| Add to Bag → Cart page | Items appear correctly |
| Checkout → Order Success | Order number shown |
| `/admin/login` | Login with `admin` / `admin` |
| Admin → Products | Table of seeded jewellery |
| Admin → Add Product | Form saves and product appears |

---

## Environment Variables — Complete Reference

### Backend (Render)

```
APP_NAME=AURA
APP_ENV=production
APP_DEBUG=false
APP_URL=https://aura-backend.onrender.com
DB_CONNECTION=sqlite
SESSION_DRIVER=file
CACHE_STORE=file
LOG_LEVEL=error
CORS_ALLOWED_ORIGINS=https://aura-jewellery.vercel.app
```

### Frontend (Vercel)

```
VITE_API_URL=https://aura-backend.onrender.com/api
```

---

## Redeployment

Every `git push main` automatically redeploys both services.

To manually redeploy:
- **Render**: Dashboard → your service → **Manual Deploy** → Deploy latest commit
- **Vercel**: Dashboard → your project → **Deployments** → **Redeploy**

---

## Common Issues

### Products grid is empty / API errors in console

**Cause**: `CORS_ALLOWED_ORIGINS` doesn't match the Vercel URL exactly.

**Fix**: In Render env vars, make sure the value has no trailing slash and matches exactly:
```
CORS_ALLOWED_ORIGINS=https://aura-jewellery.vercel.app
```
Then trigger a manual redeploy on Render.

---

### Render shows "Service unavailable" after cold start

Render free tier **spins down after 15 minutes of inactivity**. The first request after that takes ~30 seconds to wake up. This is normal on the free plan.

**Fix for production**: Upgrade to Render's Starter plan ($7/mo) or add an uptime monitor (e.g. UptimeRobot) that pings `/api/products` every 10 minutes.

---

### Vercel page shows blank white screen

**Cause**: React Router routes (like `/cart`, `/admin`) return 404 because Vercel doesn't know to serve `index.html` for them.

**Fix**: The `frontend/vercel.json` file already handles this with a rewrite rule. Make sure the file is committed and pushed.

---

### `APP_KEY` error on Render boot

The Dockerfile CMD runs `php artisan key:generate --force` automatically. If it still fails, add `APP_KEY` manually:

1. Run locally: `php artisan key:generate --show`
2. Copy the output (starts with `base64:`)
3. Paste it as the `APP_KEY` env var in Render

---

## Admin Credentials

| Field | Value |
|-------|-------|
| URL | `https://your-frontend.vercel.app/admin/login` |
| Username | `admin` |
| Password | `admin` |
