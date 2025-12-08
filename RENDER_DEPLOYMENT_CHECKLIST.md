# Render Deployment Checklist

## ✅ Files Ready for Deployment

### Required Files (All Present)
- [x] `Dockerfile` - Production-ready with Gunicorn
- [x] `requirements.txt` - All Python dependencies
- [x] `render.yaml` - Render configuration
- [x] `.gitignore` - Excludes unnecessary files
- [x] `backend/app.py` - Flask app with health check
- [x] `fortran/projectile.f90` - Fortran computation code
- [x] `frontend/` - HTML, CSS, JS files

### Configuration Verified
- [x] Gunicorn configured in Dockerfile
- [x] Health check endpoint at `/health`
- [x] Port configuration using `$PORT` environment variable
- [x] Fortran compiler (gfortran) in Dockerfile
- [x] CORS enabled for API access
- [x] Production environment variables set

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Render deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy on Render

#### Option A: Using render.yaml (Recommended)
1. Go to https://render.com
2. Sign up/Login with GitHub
3. Click "New +" → "Blueprint"
4. Connect your GitHub repository
5. Render will detect `render.yaml` and configure automatically
6. Click "Apply" to deploy

#### Option B: Manual Setup
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: projectile-simulator
   - **Environment**: Docker
   - **Region**: Choose closest to you
   - **Branch**: main
   - **Instance Type**: Free
   - **Health Check Path**: /health
5. Click "Create Web Service"

### 3. Wait for Build
- First build takes 5-10 minutes
- Render will:
  - Pull your code
  - Build Docker image
  - Install gfortran
  - Compile Fortran code
  - Install Python dependencies
  - Start Gunicorn server

### 4. Access Your App
- Your app will be live at: `https://projectile-simulator.onrender.com`
- Test the health endpoint: `https://projectile-simulator.onrender.com/health`

## 📝 Post-Deployment

### Test Your Deployment
```bash
# Test health check
curl https://YOUR_APP.onrender.com/health

# Test simulation API
curl -X POST https://YOUR_APP.onrender.com/simulate \
  -H "Content-Type: application/json" \
  -d '{"velocity": 50, "angle": 45, "drag": 0.05, "dt": 0.01, "wind": 0}'
```

### Monitor Your App
- Check logs in Render dashboard
- Monitor build status
- View deployment history

## ⚠️ Important Notes

### Free Tier Limitations
- App sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- 750 hours/month free (enough for one app running 24/7)

### Troubleshooting
If deployment fails:
1. Check build logs in Render dashboard
2. Verify Dockerfile builds locally: `docker build -t test .`
3. Check that all files are committed to Git
4. Ensure gfortran compiles successfully
5. Verify health check endpoint responds

### Upgrade to Paid Plan (Optional)
- No sleep on inactivity
- Faster builds
- More resources
- Custom domains
- Starting at $7/month

## 🔧 Environment Variables (Optional)

If you need to add environment variables:
1. Go to Render dashboard
2. Select your service
3. Go to "Environment" tab
4. Add variables:
   - `FLASK_ENV=production`
   - `SECRET_KEY=your-secret-key` (if needed)

## 📊 Expected Build Output

```
==> Cloning from GitHub...
==> Building Docker image...
==> Installing gfortran...
==> Compiling Fortran code...
==> Installing Python dependencies...
==> Starting Gunicorn...
==> Deploy successful!
```

## ✨ Your App is Live!

Once deployed, share your link:
`https://projectile-simulator.onrender.com`

Users can:
- Run projectile simulations
- Adjust parameters (velocity, angle, drag, wind)
- View interactive trajectory plots
- Export data as CSV
- Save plots as PNG
