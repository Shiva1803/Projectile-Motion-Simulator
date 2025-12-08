# Deployment Guide

## Local Testing with Docker

### Prerequisites
- Docker installed
- Docker Compose installed

### Build and Run
```bash
# Build the Docker image
docker build -t projectile-simulator .

# Run the container
docker run -p 5000:5000 projectile-simulator

# OR use docker-compose for easier development
docker-compose up
```

Visit `http://localhost:5000` in your browser.

---

## Deploy to Render

### Step 1: Prepare Repository
1. Push your code to GitHub
2. Make sure Dockerfile is in the root directory

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub

### Step 3: Deploy
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: projectile-simulator
   - **Environment**: Docker
   - **Region**: Choose closest to you
   - **Instance Type**: Free (or Starter for better performance)
4. Click "Create Web Service"

Render will automatically:
- Detect your Dockerfile
- Build the image
- Deploy your app
- Give you a public URL

### Step 4: Access Your App
Your app will be live at: `https://projectile-simulator.onrender.com`

**Note**: Free tier sleeps after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.

---

## Deploy to Railway

### Step 1: Install Railway CLI (Optional)
```bash
npm install -g @railway/cli
railway login
```

### Step 2: Deploy via Dashboard
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Dockerfile and deploys

### Step 3: Configure
- Add a custom domain (optional)
- Set environment variables if needed

---

## Deploy to Fly.io

### Step 1: Install Fly CLI
```bash
# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh

# Login
fly auth login
```

### Step 2: Initialize and Deploy
```bash
# Initialize (creates fly.toml)
fly launch

# Follow prompts:
# - Choose app name
# - Select region
# - Don't add PostgreSQL or Redis

# Deploy
fly deploy
```

### Step 3: Open Your App
```bash
fly open
```

---

## Environment Variables (if needed)

For production, you may want to set:
- `FLASK_ENV=production`
- `SECRET_KEY=your-secret-key`

Add these in your platform's dashboard or via CLI.

---

## Troubleshooting

### Fortran compilation fails
- Ensure `gfortran` is installed in Dockerfile
- Check `projectile.f90` for syntax errors

### Port binding issues
- Make sure Flask binds to `0.0.0.0` not `127.0.0.1`
- Expose correct port in Dockerfile

### File permission errors
- Ensure `/app/fortran` directory is writable
- Check that Fortran executable has execute permissions

### CORS errors
- Update CORS settings in `app.py` if needed
- For production, restrict origins instead of allowing all
