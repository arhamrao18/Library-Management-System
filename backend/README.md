# Library Management System

A Django-based Library Management System that streamlines book inventory, borrowing, and returns through role-based Admin and Member portals.

## 🚀 Features

### 🔐 Authentication & User Roles
Secure login system with two roles — **Admin** and **Member** — each with dashboards and permissions scoped to their role.

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
- **Backend:** Django
- **Database:** (add your DB, e.g. SQLite / PostgreSQL / MySQL)
- **Frontend:** (add your frontend stack, e.g. HTML, CSS, JS / Bootstrap)

## 📌 Project Highlights
- Real-time book availability tracking to prevent over-borrowing of limited-stock books.
- Clean separation of Admin and Member workflows for request handling (borrow/return).
- Built with a focus on core CRUD operations and practical library workflow automation.

## 📷 Demo
*(Add screenshots or a link to your demo video here)*

## ⚙️ Installation
```bash
git clone <your-repo-url>
cd library-management-system
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## 📄 License
*(Add your license here)*

## 🙋‍♂️ Author
**Arham** — Django Backend Developer
