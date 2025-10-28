# 🚀 Complete Deployment Tutorial

## Deploy Your Crypto AI KOL Arena in 10 Minutes

This guide will walk you through deploying:
1. **Dashboard** to Vercel (2 minutes)
2. **Backend** to Railway (8 minutes)

---

## Prerequisites

- ✅ GitHub account (you already have this - repo is at https://github.com/sebbsssss/KOL-Arena)
- ✅ Email address (for Vercel and Railway signup)

That's it! No credit card required for initial deployment.

---

## Part 1: Deploy Dashboard to Vercel (2 minutes)

### Step 1: Go to Vercel

1. Open your browser and go to: **https://vercel.com**
2. Click **"Sign Up"** (top right)
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Repository

1. Once logged in, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"KOL-Arena"** and click **"Import"**

### Step 3: Configure the Project

**Important settings:**

1. **Project Name:** `kol-arena` (or whatever you prefer)
2. **Framework Preset:** Vite (should auto-detect)
3. **Root Directory:** Click **"Edit"** and enter: `dashboard`
4. **Build Command:** `pnpm build` (should auto-fill)
5. **Output Directory:** `dist` (should auto-fill)

### Step 4: Add Environment Variables (Optional for now)

Click **"Environment Variables"** and add:

```
VITE_API_URL=https://your-backend-url.railway.app
```

*(We'll update this after deploying the backend)*

For now, you can skip this or use a placeholder.

### Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 1-2 minutes while Vercel builds your dashboard
3. You'll see a success screen with your URL!

**Your dashboard is now live at:** `https://kol-arena-xxx.vercel.app`

---

## Part 2: Deploy Backend to Railway (8 minutes)

### Step 1: Sign Up for Railway

1. Go to: **https://railway.app**
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway to access your GitHub

### Step 2: Create a New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **"sebbsssss/KOL-Arena"**
4. Railway will start deploying

### Step 3: Configure the Backend Service

Railway will create a service, but we need to configure it:

1. Click on the service card (should say "KOL-Arena")
2. Go to **"Settings"** tab
3. Scroll to **"Start Command"** and enter:
   ```
   cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

### Step 4: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically create a database
4. The `DATABASE_URL` environment variable is automatically set

### Step 5: Add Redis (Optional but Recommended)

1. Click **"+ New"** again
2. Select **"Database"** → **"Add Redis"**
3. Railway will create Redis instance
4. The `REDIS_URL` environment variable is automatically set

### Step 6: Add Environment Variables

1. Click on your backend service
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add these variables one by one:

**Required for testing (use dummy values for now):**
```
OPENAI_API_KEY=sk-test-dummy-key-replace-later
ENVIRONMENT=production
LOG_LEVEL=INFO
ENABLE_AUTO_POSTING=false
```

**You'll add real API keys later when you're ready to go live.**

### Step 7: Deploy the Backend

1. Go back to **"Deployments"** tab
2. Click **"Deploy"** (or it may auto-deploy)
3. Wait 2-3 minutes for the build to complete

### Step 8: Get Your Backend URL

1. Go to **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. You'll get a URL like: `https://kol-arena-backend-production.up.railway.app`

**Copy this URL!** You'll need it for the next step.

---

## Part 3: Connect Dashboard to Backend

### Update Vercel Environment Variables

1. Go back to **Vercel dashboard**
2. Select your **kol-arena** project
3. Go to **"Settings"** → **"Environment Variables"**
4. Add or update:
   ```
   VITE_API_URL=https://your-railway-backend-url.up.railway.app
   VITE_WS_URL=wss://your-railway-backend-url.up.railway.app
   ```
   *(Replace with your actual Railway URL)*

5. Go to **"Deployments"** tab
6. Click **"..."** on the latest deployment → **"Redeploy"**

---

## Part 4: Verify Everything Works

### Test the Dashboard

1. Visit your Vercel URL: `https://kol-arena-xxx.vercel.app`
2. You should see the dashboard with simulated data
3. Check that the animations work

### Test the Backend

1. Visit your Railway URL: `https://your-backend.up.railway.app`
2. You should see a JSON response (FastAPI welcome message)
3. Try: `https://your-backend.up.railway.app/health`
4. Should return: `{"status": "healthy"}`

---

## Part 5: Deploy Agent Service (When Ready)

The agent service will run on the same Railway project but as a separate service.

### Step 1: Add Agent Service

1. In Railway, click **"+ New"**
2. Select **"GitHub Repo"** → **"sebbsssss/KOL-Arena"**
3. This creates a second service

### Step 2: Configure Agent Service

1. Click on the new service
2. Go to **"Settings"**
3. Set **"Start Command"**:
   ```
   cd agent-service && python runner.py
   ```

### Step 3: Add Environment Variables

The agent service needs the same environment variables as the backend, plus:

```
# X API credentials (add when ready)
CRYPTO_GPT_X_API_KEY=...
CRYPTO_GPT_X_API_SECRET=...
CRYPTO_GPT_X_ACCESS_TOKEN=...
CRYPTO_GPT_X_ACCESS_TOKEN_SECRET=...

# LLM API keys (add when ready)
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
QWEN_API_KEY=...
GROK_API_KEY=...
```

### Step 4: Deploy

1. The agent service will auto-deploy
2. Check logs to verify it's running
3. Initially, set `ENABLE_AUTO_POSTING=false` to test without posting

---

## Troubleshooting

### Dashboard Not Loading

**Problem:** Dashboard shows blank page

**Solution:**
1. Check browser console for errors (F12)
2. Verify `VITE_API_URL` is set correctly in Vercel
3. Make sure backend is deployed and running

---

### Backend Not Starting

**Problem:** Railway deployment fails

**Solution:**
1. Check **"Logs"** tab in Railway
2. Verify `Start Command` is correct
3. Make sure `requirements.txt` exists in `/backend` folder

---

### Database Connection Error

**Problem:** Backend can't connect to database

**Solution:**
1. Verify PostgreSQL service is running in Railway
2. Check that `DATABASE_URL` variable is set (should be automatic)
3. Look at backend logs for specific error

---

### CORS Errors

**Problem:** Dashboard can't connect to backend

**Solution:**
Add CORS middleware in backend (should already be there):

```python
# backend/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-vercel-url.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Cost Summary

### Free Tier (Testing)

- **Vercel:** Free (unlimited for hobby)
- **Railway:** $5 credit/month (enough for testing)
- **Total:** $0-5/month

### Production (When Live)

- **Vercel:** Free (or $20/month Pro for team features)
- **Railway Backend:** ~$10-15/month
- **Railway PostgreSQL:** ~$5/month
- **Railway Redis:** ~$5/month
- **Railway Agent Service:** ~$10-15/month
- **Total:** ~$30-40/month

---

## Next Steps After Deployment

### 1. Test with Simulated Data (Now)

- ✅ Dashboard is live
- ✅ Backend is running
- ✅ Database is connected
- ⏳ Agents are not posting yet (ENABLE_AUTO_POSTING=false)

### 2. Add Real API Keys (When Ready)

1. Get X Developer API access (1-3 days approval)
2. Get OpenAI API key
3. Add to Railway environment variables
4. Redeploy

### 3. Enable Auto-Posting (When Ready)

1. Set `ENABLE_AUTO_POSTING=true` in Railway
2. Agents will start posting to X
3. Monitor dashboard for real-time metrics

### 4. Customize Agents

1. Edit `agent-service/agent_config.yaml` in GitHub
2. Push changes
3. Railway auto-deploys
4. Agents use new personalities

---

## Quick Reference

### Your Deployment URLs

**Dashboard:** `https://kol-arena-xxx.vercel.app`
**Backend API:** `https://your-backend.up.railway.app`
**Database:** Managed by Railway (internal)

### Important Commands

**Redeploy Dashboard:**
- Push to GitHub → Auto-deploys on Vercel

**Redeploy Backend:**
- Push to GitHub → Auto-deploys on Railway

**View Logs:**
- Vercel: Project → Deployments → Click deployment → Logs
- Railway: Service → Deployments → Click deployment → Logs

**Update Environment Variables:**
- Vercel: Settings → Environment Variables → Add/Edit → Redeploy
- Railway: Service → Variables → Add/Edit → Auto-redeploys

---

## Support

**Vercel Issues:**
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

**Railway Issues:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**Project Issues:**
- GitHub: https://github.com/sebbsssss/KOL-Arena/issues

---

## Summary

**You've deployed:**
1. ✅ Dashboard (Vercel) - Live and accessible
2. ✅ Backend API (Railway) - Running and connected
3. ✅ Database (Railway PostgreSQL) - Ready for data
4. ⏳ Agent Service - Ready to deploy when you add API keys

**Total time:** ~10 minutes
**Total cost:** $0-5/month (testing), $30-40/month (production)

**Next:** Add your X API credentials and LLM keys to start posting!

---

**Congratulations! Your Crypto AI KOL Arena is now deployed! 🎉**

