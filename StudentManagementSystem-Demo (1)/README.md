# Student Management System — Live Demo (Static Version)

This is a **frontend-only demo** of the Student Management System, built so it can be deployed
to static hosts like **Netlify** or **GitHub Pages** and clicked through live by anyone —
no server, database, or installation required.

⚠️ **This is a demo, not the real backend.** It uses `localStorage`/`sessionStorage` in the
browser to simulate a database (see `js/db.js`). The actual project — with Core Java Servlets,
JDBC, and Oracle SQL — lives in the separate `StudentManagementSystem` (backend) project.
Link both from your resume: this one for a live click-through, the Java one as the real source.

## Demo credentials
- **Admin** — username `admin`, password `admin123`
- **Student** — email `aditi@example.com`, password `demo123`

## Deploy to Netlify (drag-and-drop, no account setup needed for a quick test)

1. Go to https://app.netlify.com/drop
2. Drag the **entire `StudentManagementSystem-Demo` folder** (not the zip) onto the page.
3. Netlify gives you a live URL in seconds, e.g. `https://random-name-123.netlify.app`.
4. (Optional) Go to **Site settings → Change site name** to get a cleaner URL.

### Deploy via GitHub (recommended — auto-redeploys on every push)
1. Push this folder to a new GitHub repo:
   ```bash
   cd StudentManagementSystem-Demo
   git init
   git add .
   git commit -m "Student Management System - live demo"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/StudentManagementSystem-Demo.git
   git push -u origin main
   ```
2. On Netlify: **Add new site → Import an existing project → GitHub** → pick the repo.
3. Build command: leave blank. Publish directory: `.` (root).
4. Click **Deploy site**.

## Deploy to GitHub Pages (alternative, also free)
1. Push the folder to a GitHub repo (same as above).
2. Go to **Settings → Pages** in the repo.
3. Source: **Deploy from a branch** → branch `main`, folder `/ (root)`.
4. Your site will be live at `https://YOUR_USERNAME.github.io/StudentManagementSystem-Demo/`.

## What to put on your resume
```
Student Management System | Java, JDBC, Oracle SQL, HTML/CSS/JS
Live Demo: https://your-site.netlify.app
Source Code: https://github.com/YOUR_USERNAME/StudentManagementSystem
```
Keep both links — the live demo lets a recruiter click through the UI in 30 seconds,
and the GitHub repo (the real Java/JDBC/Oracle version) is what you talk through in the interview.

## File structure
```
StudentManagementSystem-Demo/
├── index.html
├── login.html
├── register.html
├── admin-dashboard.html
├── student-dashboard.html
├── view-students.html
├── manage-courses.html
├── manage-marks.html
├── attendance.html
├── css/style.css
├── js/
│   ├── db.js       # mock database (localStorage) — replaces Servlets+JDBC+Oracle for this demo
│   └── guard.js     # simple session guard for protected pages
└── netlify.toml
```

## Resetting demo data
Data persists in your browser's localStorage. To reset it to the original seed data,
open the browser console on any page and run:
```js
DB.resetDemoData();
```
