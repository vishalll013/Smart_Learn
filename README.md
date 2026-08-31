# Smart Learning for Young Minds

An interactive, responsive, and child-friendly educational platform designed for children aged 6–16, parents, and teachers. The platform includes educational courses, multiple-choice quizzes with countdown timers, HTML5 canvas/JavaScript games (Math Challenge, Memory Card Match, Word Speed Typer), worksheets, downloadable PDF notes, and dashboard portals for all four roles.

---

## 🚀 Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS v3, Framer Motion, Recharts, Lucide Icons, Browser SpeechSynthesis (Text-to-Speech).
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.
- **Seeding:** MongoDB custom javascript seed loader.

---

## 📂 Project Structure

```
Smart Learn/
├── package.json                 # Monorepo configuration
├── README.md                    # Setup and runtime instructions
├── backend/                     # Express API Server
│   ├── config/db.js             # Mongoose MongoDB connection
│   ├── models/                  # Schemas (User, Course, Quiz, Progress, Announcement, Resource)
│   ├── routes/                  # API Routers (auth, courses, quizzes, resources, dashboard, announcements)
│   ├── middleware/auth.js       # JWT Protect and Role guards
│   ├── scripts/seed.js          # MongoDB seeding script
│   └── server.js                # Server entry point
└── frontend/                    # Vite React Client
    ├── tailwind.config.js       # Pastel style guidelines
    ├── vite.config.js           # API proxy targets
    ├── index.html               # Main HTML viewport & Poppins font loader
    └── src/
        ├── index.css            # Styles, glassmorphic grids, custom scrollbars
        ├── main.jsx             # React DOM entry
        ├── App.jsx              # Routing configurations
        ├── context/AuthContext.jsx # Login/Registration and mock fallbacks handler
        ├── components/          # Reusable Navbar, Footer, and ThemeToggle elements
        └── pages/               # Views (Home, About, Courses, Games, Quizzes, Contact, Resource downloads, Dashboards)
```

---

## 🏃 Getting Started

### 1. Installation
Install all dependencies for both frontend and backend from the root workspace folder:
```bash
npm run install-all
```

### 2. Configure Environment (.env)
A default `.env` has been auto-created in `backend/` using default values:
- `PORT=5000`
- `MONGODB_URI=mongodb://127.0.0.1:27017/smartlearn`
- `JWT_SECRET=secret12345`

### 3. Database Seeding
Ensure MongoDB is running locally, then execute the seeding script to populate default users, math/science courses, quizzes, and worksheets:
```bash
npm run seed
```

### 4. Running Locally
Start both the Vite React dev server (port `5173`) and the Node Express server (port `5000`) concurrently:
```bash
npm run dev
```

---

## 🔑 Demo Account Credentials

To help developers review all four dashboard panels, the platform features a **"Demo Account" Quick Switcher Dropdown** in the navbar to swap active dashboards instantly. You can also sign in using the following default seeded credentials:

- **👦 Student Dashboard:** `student@smartlearn.com` / `password123`
- **👩 Parent Dashboard:** `parent@smartlearn.com` / `password123`
- **👩‍🏫 Teacher Dashboard:** `teacher@smartlearn.com` / `password123`
- **⚙️ Admin Dashboard:** `admin@smartlearn.com` / `password123`

---

## 🌟 Interactive Features Summary

1. **Talking Flashcards:** Card flip animations that speak their definitions aloud utilizing the browser's built-in SpeechSynthesis engine.
2. **Science Chemical Lab:** Simulates test tube acid/base mixing in a beaker with bubble particle animations and reaction messages.
3. **Spelling Matcher:** Interactive spelling builder where kids rearrange jumbled letters matching cute emojis.
4. **Mental Math Game:** Quick-fire mental calculation questions with streak points tracking and high-score saves.
5. **Memory Board Game:** Cute animal pair matching cards with flipping transitions.
6. **Typing Speed Test:** Words presentation speed challenger.
7. **Certificate Generator:** Finish a course 100% to generate a printable, unique verification diploma.
