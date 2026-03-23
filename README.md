# POS System

React + Vite frontend with API routes and MongoDB persistence.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Configure MongoDB in `server/config.env`:

```env
ATLAS_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Cluster0
DB_NAME=pos_system
```

3. Test backend DB connectivity:

```bash
npm run db:test
```

4. Run backend and frontend:

```bash
npm run dev:server
npm run dev
```

## Deploy To Vercel

The app is set up to use same-origin `/api/*` routes in production.
You do not need `VITE_API_BASE_URL` for normal Vercel deployments.

### Required Vercel Environment Variables

Set these in Vercel Project Settings -> Environment Variables:

- `ATLAS_URI`
- `DB_NAME` (example: `pos_system`)

### Atlas Network Access

In MongoDB Atlas, allow Vercel to connect:

- Atlas -> Network Access -> Add IP Address
- Use `0.0.0.0/0` (Allow access from anywhere)

### Atlas Database User

Make sure the Atlas DB user in `ATLAS_URI`:

- Exists
- Has correct password
- Has read/write access to the database

### Deploy

```bash
vercel --prod
```

Or deploy from GitHub through the Vercel dashboard.

## Backend Health Checks

After deploy, test these endpoints:

- `/api/health`
- `/api/products`
- `/api/state`

Example:

```bash
curl https://<your-vercel-domain>/api/health
```

Expected result:

```json
{ "ok": true }
```

## If Backend Still Fails

1. Check Vercel Function logs for API errors.
2. Confirm `ATLAS_URI` and `DB_NAME` are set in Vercel (Production environment).
3. Confirm Atlas network access allows Vercel.
4. Confirm Atlas username/password and permissions are correct.
5. Redeploy after changing any environment variable.

## Notes

- `VITE_ENABLE_REMOTE_SYNC` can force sync on/off:
  - `true` to force enabled
  - `false` to force disabled
- If `VITE_API_BASE_URL` is set to localhost in production, it is ignored automatically.
