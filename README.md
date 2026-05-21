# HabitFlow — Daily Habit Tracker

A full-stack daily habit tracking web application built with the MERN stack. Users can register, log in, create habits, mark them complete every day, and track their streaks over time.

---

## 🚀 Live Demo

> Run locally — see setup instructions below.

---

## ✨ Features

- 🔐 User registration and login with JWT authentication
- ➕ Add habits with name and time of day
- ✅ Mark habits complete / undo completion per day
- 🔥 Streak tracking for each habit
- 📅 Monthly progress calendar with completion indicators
- 👤 Profile page with total habits, current streak and best streak
- 👋 Personalized greeting based on logged-in user and time of day
- 🌍 Timezone-aware date handling
- 📱 Responsive design for all screen sizes

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router, Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Styling | CSS3, Plus Jakarta Sans |
| Language | JavaScript (ES6+), HTML5 |

---

## 📁 Project Structure

```
Daily-Habit-Tracker/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── habitController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Habit.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── habitRoutes.js
│   ├── .env
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── api/
        │   └── index.js
        ├── components/
        │   ├── AuthForm.js
        │   ├── HabitCard.js
        │   ├── HabitList.js
        │   ├── MonthlyCalendar.js
        │   └── Navbar.js
        ├── pages/
        │   ├── DashboardPage.js
        │   ├── LoginPage.js
        │   ├── ProfilePage.js
        │   ├── ProgressCalendarPage.js
        │   └── RegisterPage.js
        ├── App.js
        └── index.css
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js installed
- MongoDB Compass or MongoDB Atlas account

### 1. Clone the repository

```bash
git clone https://github.com/your-username/daily-habit-tracker.git
cd daily-habit-tracker
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=mongodb://localhost:27017/habittracker
JWT_SECRET=your_secret_key_here
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The app will open at **http://localhost:3000**

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | A long random secret string for signing tokens |
| `PORT` | Backend port (default: 5000) |

---

## 📸 Pages

| Page | Description |
|---|---|
| Dashboard | View and manage all habits, mark complete |
| Progress | Monthly calendar with completion history |
| Profile | User stats — total habits, streaks |
| Login | JWT-based secure login |
| Register | Create a new account |

---

## 👨‍💻 Author

**Your Name**
[GitHub](https://github.com/kashish706) 

---

## 📄 License

This project is for educational purposes.
