# Bookish Corner — Cozy Reading Tracker

A full-stack, portfolio-grade personal reading tracker (Goodreads/StoryGraph style) with a cozy, forest-green cottagecore aesthetic.

## Project Structure
This is a monorepo containing:
- **`frontend/`**: Vite + React 18 frontend (Tailwind CSS, Framer Motion, Axios).
- **`backend/`**: Django + Django REST Framework backend (SQLite in dev, PostgreSQL for production, django-allauth, dj-rest-auth).

---

## Getting Started

### Backend Setup (Django)
1. **Navigate to backend**:
   ```bash
   cd backend
   ```
2. **Create a virtual environment** and activate it:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Create a `.env` file** matching the fields in `.env.example`.
5. **Run migrations**:
   ```bash
   python manage.py migrate
   ```
6. **Start the development server**:
   ```bash
   python manage.py runserver
   ```
   The backend will run on `http://127.0.0.1:8000/`.

---

### Frontend Setup (React + Vite)
1. **Navigate to frontend**:
   ```bash
   cd frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Create a `.env` file** matching the fields in `.env.example`.
4. **Start the dev server**:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173/` (or the port shown by Vite).
