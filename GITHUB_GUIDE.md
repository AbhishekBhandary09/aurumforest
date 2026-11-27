# AurumForest — GitHub Storage & Deployment Guide

A complete step-by-step guide to push your AurumForest luxury travel website to GitHub and deploy it live for free using GitHub Pages.

---

## Part 1 — Store on GitHub (Version Control)

### Step 1 · Create a GitHub Account
If you don't have one, go to **https://github.com** and sign up for a free account.

---

### Step 2 · Create a New Repository

1. Click the **"+"** icon in the top-right corner of GitHub
2. Select **"New repository"**
3. Fill in the form:
   - **Repository name:** `aurumforest`
   - **Description:** `Luxury Travel & Expedition Landing Page`
   - **Visibility:** Public *(required for free GitHub Pages hosting)*
   - Leave "Add a README" **unchecked**
4. Click **"Create repository"**

GitHub will show you an empty repo with setup instructions. Keep this tab open.

---

### Step 3 · Install Git on Your Computer

**Check if Git is already installed:**
```bash
git --version
```

If you see `git version 2.x.x`, skip this step.

**If not installed:**
- **Windows:** Download from https://git-scm.com/download/win
- **Mac:** Run `xcode-select --install` in Terminal
- **Linux:** Run `sudo apt install git`

---

### Step 4 · Set Up Your Project Folder

Open **Terminal** (Mac/Linux) or **Git Bash** (Windows) and run:

```bash
# 1. Create your project folder
mkdir aurumforest
cd aurumforest

# 2. Copy your index.html file into this folder
#    (move the downloaded index.html here)

# 3. Verify the file is there
ls
# You should see: index.html
```

---

### Step 5 · Initialise Git & Push to GitHub

```bash
# 1. Initialise a new Git repository
git init

# 2. Tell Git who you are (one-time setup)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# 3. Stage all files
git add .

# 4. Make your first commit
git commit -m "feat: initial AurumForest landing page"

# 5. Rename the branch to 'main'
git branch -M main

# 6. Connect to your GitHub repository
#    (replace AbhishekBhandary09 with your actual GitHub username)
git remote add origin https://github.com/AbhishekBhandary09/aurumforest.git

# 7. Push your code to GitHub
git push -u origin main
```

Your code is now on GitHub. Refresh your repository page to see `index.html` listed.

---

## Part 2 — Deploy Live with GitHub Pages (Free Hosting)

GitHub Pages serves your HTML file as a real public website — no server needed.

### Step 6 · Enable GitHub Pages

1. Go to your repository on GitHub: `github.com/AbhishekBhandary09/aurumforest`
2. Click **"Settings"** (top tab with the gear icon)
3. Scroll down to the **"Pages"** section in the left sidebar
4. Under **"Source"**, select:
   - Branch: **`main`**
   - Folder: **`/ (root)`**
5. Click **"Save"**

GitHub will display:
> ✅ *Your site is live at https://AbhishekBhandary09.github.io/aurumforest/*

It usually takes **1–3 minutes** to go live.

---

### Step 7 · Visit Your Live Website

Open your browser and navigate to:
```
https://AbhishekBhandary09.github.io/aurumforest/
```

Your full AurumForest site — globe, AI concierge, golden hour theme, flight arcs, magnetic buttons — is now live on the internet.

---

## Part 3 — Making Updates Later

Every time you change `index.html`, push the update with these 3 commands:

```bash
# Stage changes
git add .

# Commit with a message describing what changed
git commit -m "fix: update concierge welcome message"

# Push to GitHub (Pages auto-deploys in ~1 min)
git push
```

---

## Part 4 — Recommended Project Structure (Optional Expansion)

If you later split the project into separate files, organise it like this:

```
aurumforest/
├── index.html          ← Main landing page (your current file)
├── README.md           ← Project description shown on GitHub
├── assets/
│   ├── css/
│   │   └── style.css   ← Extracted styles (optional)
│   ├── js/
│   │   ├── globe.js    ← Globe + flight arc logic
│   │   ├── concierge.js← AI Concierge logic
│   │   └── main.js     ← Cursor, golden hour, magnetic buttons
│   └── images/
│       └── og-image.jpg← Social preview image
└── .gitignore          ← Files Git should ignore
```

**Create a .gitignore file** (good practice):
```bash
echo "node_modules/
.DS_Store
*.env
.env.local" > .gitignore
git add .gitignore
git commit -m "chore: add .gitignore"
git push
```

---

## Part 5 — Add a Custom Domain (Optional)

If you own a domain like `aurumforest.com`:

1. In **GitHub Pages Settings**, enter your domain under **"Custom domain"**
2. Add a `CNAME` file to your repo:
```bash
echo "aurumforest.com" > CNAME
git add CNAME
git commit -m "chore: add custom domain"
git push
```
3. In your domain registrar (Namecheap, GoDaddy, etc.), add these DNS records:

| Type  | Host | Value                   |
|-------|------|-------------------------|
| A     | @    | 185.199.108.153         |
| A     | @    | 185.199.109.153         |
| A     | @    | 185.199.110.153         |
| A     | @    | 185.199.111.153         |
| CNAME | www  | AbhishekBhandary09.github.io |

DNS changes can take up to 48 hours to propagate. GitHub will then auto-issue a free SSL certificate (https://).

---

## Quick Reference Card

| Command | What it does |
|---------|-------------|
| `git init` | Start tracking a folder with Git |
| `git add .` | Stage all changed files |
| `git commit -m "message"` | Save a snapshot |
| `git push` | Upload to GitHub |
| `git pull` | Download latest changes from GitHub |
| `git status` | See what files have changed |
| `git log --oneline` | View commit history |

---

*AurumForest · Built with Three.js, GSAP, Claude AI · Hosted free on GitHub Pages*
