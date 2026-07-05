# Library Management System

A full-stack Library Management System — Django REST Framework backend with a React frontend — that streamlines book inventory, borrowing, and returns through role-based Admin and Member portals.

## 🚀 Features

### 🔐 Authentication & User Roles
Secure login system with two roles — **Admin** and **Member** — each with dashboards and permissions scoped to their role. Frontend uses Token Authentication.

### 📚 Book Management (CRUD)
Admin can **add, update, view, and delete** books from the library catalog, keeping the inventory accurate and up to date.

### 👥 Member Management
Admin can **add and manage members**, controlling who has access to borrow books from the library.

### 📖 Borrow Request System
- Members can send a **borrow request** for any available book.
- Admin can **view all borrow requests** and **accept or reject** them.
- **Stock-aware borrowing** — if only one copy of a book is available and it's already borrowed, the system prevents further borrow requests until it's returned.

### 🔄 Return Request System
- Members can request to **return** a borrowed book.
- Admin can review and process return requests, updating book availability automatically.

### 🙍 Profile Management
- Every user (Admin and Member) can **view their own profile**.
- Users can **change their password** securely from within their profile.

## 🛠️ Tech Stack
- **Backend:** Django, Django REST Framework
- **Database:** (add your DB, e.g. SQLite / PostgreSQL / MySQL)
- **Frontend:** React

## 📌 Project Highlights
- Real-time book availability tracking to prevent over-borrowing of limited-stock books.
- Clean separation of Admin and Member workflows for request handling (borrow/return).
- Built with a focus on core CRUD operations and practical library workflow automation.

## 📷 Demo
*(Add screenshots or a link to your demo video here)*

## ⚙️ Backend Setup (Django)
```bash
git clone <your-repo-url>
cd library-management-system
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## 💻 Frontend Setup (React)

1. Install dependencies:
```bash
npm install
```

2. Start the dev server:
```bash
npm run dev
```
This runs on `http://localhost:5173` by default.

3. Make sure your Django backend is running with the API routes and CORS configured.

4. Open `http://localhost:5173`, log in with your superuser credentials. If your Django API runs on a different host/port, update the "API base URL" field on the login page — it's saved automatically.

## 📝 Frontend Notes
- Auth token is stored in `localStorage` and attached to every API request.
- Image uploads (book covers, member photos) are sent as `multipart/form-data`.
- If a request gets a 401 (invalid/expired token), you're redirected to login automatically.

## 📄 License
*(Add your license here)*

## 🙋‍♂️ Author
**Arham** — Django Backend Developer