# 📚 Stacks — Library Management System

A full-stack **Library Management System** built with **Django REST Framework** and **React**, featuring two dedicated portals — a **Manager Dashboard** for full library administration and a **Member Portal** for browsing, borrowing, and self-service account management.

> Clean, modern UI · JWT-secured API · Role-based access · Fully responsive

---

## ✨ Highlights

| | |
|---|---|
| 🔐 **Secure Auth** | JWT (access + refresh tokens) for managers, hashed credentials for members |
| 🖥️ **Two Portals** | Manager Dashboard + Member Self-Service Portal, from one landing page |
| 📖 **Full Catalog Control** | Add, search, and manage books with cover images and stock quantity |
| 👥 **Member Management** | Register members, track profiles, manage borrowing history |
| 🔄 **Borrow Workflow** | Request → Approve → Return, with live stock updates |
| 🎨 **Premium UI** | Custom Navy & Gold theme, smooth animations, fully responsive layout |

---

## 🖼️ Portals Overview

### Manager Dashboard
Full administrative control over the library:
- Book catalog (add / search / delete, cover images, stock levels)
- Member registry (add / search / remove members)
- Borrow request approvals
- Active borrowed books tracking
- Return processing

### Member Portal
Self-service experience for library members:
- Browse and search the book catalog
- Request to borrow available books
- Track request status (Pending / Approved / Returned)
- Cancel pending requests or request a return
- Manage profile & change password

Both portals are reached from a single landing dashboard where the user chooses **Manager** or **Member** before signing in.

---

## 🛠️ Tech Stack

**Backend**
- Django 6 + Django REST Framework
- JWT Authentication (`djangorestframework-simplejwt`)
- SQLite (default, swappable for PostgreSQL/MySQL in production)
- `django-cors-headers` for cross-origin API access
- Pillow for image handling

**Frontend**
- React 18 + Vite
- React Router v6
- Axios (with automatic access-token refresh)
- Custom CSS design system (no UI framework dependency)

---

## 📁 Project Structure

```
library/
├── frontend/
│   ├── backend/                  # Django project (API)
│   │   ├── library/              # Project settings & root URLs
│   │   ├── manager/               # Manager app: books, members, borrowing, JWT login
│   │   ├── member/                 # Member app: self-service API (login, browse, requests, profile)
│   │   └── media/                 # Uploaded book & member images
│   │
│   └── frontend_new/              # React (Vite) application
│       └── src/
│           ├── pages/              # Manager pages (Books, Members, Borrowed, Returns, …)
│           ├── pages/member/       # Member portal pages
│           ├── components/         # Layouts & route guards (Manager / Member)
│           └── api.js              # Axios instance with JWT auto-refresh
```

---

## 🚀 Getting Started

### 1. Backend (Django API)

```bash
cd library/frontend/backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install django djangorestframework djangorestframework-simplejwt django-cors-headers pillow

python manage.py migrate
python manage.py createsuperuser   # create a manager login
python manage.py runserver
```

API runs at **`http://127.0.0.1:8000/`**

### 2. Frontend (React)

```bash
cd library/frontend/frontend_new
npm install
npm run dev
```

App runs at **`http://127.0.0.1:5173/`**

Open the frontend in your browser — you'll land on the **role selection dashboard**, where you can continue as **Manager** or **Member**.

---

## 🔑 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/login/` | Manager login (JWT) |
| `POST` | `/api/token/refresh/` | Refresh access token |
| `GET/POST` | `/api/books/` | List / create books |
| `DELETE` | `/api/books/<id>/` | Delete a book |
| `GET/POST` | `/api/members/` | List / register members |
| `GET` | `/api/borrowed/` | List borrow records (filter by status) |
| `PATCH` | `/api/borrowed/<id>/approve/` | Approve a borrow request |
| `PATCH` | `/api/borrowed/<id>/approve_return/` | Approve a book return |
| `POST` | `/api/member/login/` | Member login |
| `GET` | `/api/member/books/` | Browse catalog (member view) |
| `POST` | `/api/member/borrow/` | Request to borrow a book |
| `GET` | `/api/member/requests/` | Member's active requests |
| `POST` | `/api/member/change-password/` | Update member password |

All manager endpoints require a valid JWT (`Authorization: Bearer <token>`).

---

## 🔒 Security Notes

- Manager authentication uses Django's JWT system with automatic token refresh.
- Member passwords are hashed using Django's built-in password hashing (`PBKDF2`) — never stored in plain text.
- `DEBUG` and `SECRET_KEY` in `settings.py` are configured for local development. **Before deploying to production**, set `DEBUG = False`, move `SECRET_KEY` to an environment variable, and configure `ALLOWED_HOSTS`.

---

## 🗺️ Roadmap / Possible Extensions

- Email notifications on request approval / due dates
- Fine calculation for overdue returns
- Manager analytics dashboard (most borrowed books, active members)
- PostgreSQL support for production deployment
- Dockerized setup for one-command local development


<p align="center">Built with Django REST Framework &amp; React</p>
