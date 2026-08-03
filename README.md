# 📖 Bookish Corner

A full-stack personal reading tracker, inspired by Goodreads and StoryGraph, wrapped in a cozy forest-green **cottagecore** aesthetic — botanical accents, torn-paper motifs, and a warm, hand-kept-journal feel.

![Status](https://img.shields.io/badge/status-active-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Overview

Bookish Corner is a self-hosted reading tracker built to log books, track reading progress, and organize a personal library — designed and built end-to-end as a portfolio project demonstrating full-stack development, cloud deployment, and thoughtful UI/UX design.

**Live demo:** _add deployed link here_

---

## 🛠 Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Framer Motion (animations)
- Axios

**Backend**
- Django + Django REST Framework
- django-allauth / dj-rest-auth (Google OAuth)
- PostgreSQL (via [Neon](https://neon.tech)) in production, SQLite for local dev

**Infrastructure**
- Frontend deployed on **Vercel**
- Backend deployed on **Render**
- Database hosted on **Neon** (serverless Postgres)

---

## 🚀 Features

- Add, edit, and track books with reading status (want to read / currently reading / finished)
- Google OAuth login for secure, passwordless auth
- Personal library with a clean, cottagecore-inspired reading dashboard
- RESTful API backend, fully decoupled from the frontend

> **Scope note:** This is intentionally CRUD-focused for v1. Vibe-based/semantic search (embeddings) is a planned future addition, not yet implemented.

---

## 📂 Project Structure

This is a monorepo containing:

```
BookishCorner/
├── backend/        # Django + DRF REST API
└── frontend/        # Vite + React 18 client
```

- **`frontend/`** — Vite + React 18 app (Tailwind CSS, Framer Motion, Axios)
- **`backend/`** — Django + DRF API (SQLite in dev, PostgreSQL in production, django-allauth, dj-rest-auth)

---

## 🧑‍💻 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- A PostgreSQL database (or use SQLite locally)

### Backend Setup (Django)

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate       # macOS/Linux
venv\Scripts\activate          # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env           # then fill in the values

# Run migrations
python manage.py migrate

# Start the dev server
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000/`

### Frontend Setup (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env           # then fill in the values

# Start the dev server
npm run dev
```

Frontend runs at `http://localhost:5173/`

---

## 🔐 Environment Variables

Each of `backend/` and `frontend/` has its own `.env.example` — copy it to `.env` and fill in your own values (database URL, Google OAuth client credentials, API base URL, etc.) before running either app.

---

## 🗺 Roadmap

- [ ] Semantic / "vibe" search over the library using embeddings
- [ ] Reading stats & yearly wrap-up dashboard
- [ ] Public shareable profile pages

---

## 👩‍💻 Author

**Sushma Shree Asthana**
B.Tech CSE (AI Specialization), PSIT Kanpur
[GitHub](https://github.com/SushmaShreeAsthana)

---

## 📄 License

This project is licensed under the MIT License.
