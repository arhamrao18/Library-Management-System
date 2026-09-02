# 📚 Stacks — Library Management System

A full-stack library management system with a secure member portal, automated book due-dates and fines, a monthly membership fee system, and online fee payments via Stripe.

Built with **Django REST Framework** (backend) and **React + Vite** (frontend).

---

## ✨ Features

### 🔐 Security
- Passwords hashed with Django's password hashers (never stored in plain text)
- Custom JWT authentication for the member portal, separate from the admin's Django auth
- Member identity is always derived from the JWT token — never trusted from client-supplied input (protects against IDOR attacks)

### 📖 Book Borrowing & Due Dates
- Members browse the catalog and request to borrow books
- Admin approves or rejects requests (rejection requires a reason, which the member can see)
- Approved borrows get an automatic due date (15 days from approval)
- Returning a book after the due date automatically calculates a late fine
- Overdue books are flagged for both admin and the member

### 💰 Membership Fees
- Every member is charged a fee automatically when they join
- Monthly fee records are generated for all members (via a management command, runnable manually or on a schedule/cron)
- Fees that pass their due date are automatically marked **Overdue** with a fine
- Admin dashboard shows every member's fee history, status, and totals collected/outstanding
- Members can view their own fee history and current balance

### 💳 Online Payments (Stripe)
- Members pay their membership fee directly from their portal using Stripe Checkout (test mode)
- Payments are verified server-side with Stripe before being marked as paid (never trusts the frontend alone)
- A receipt is generated and shown to the member after a successful payment
- Admin sees the updated "Paid" status immediately

### 🔔 Notifications
- Admin sidebar shows a live badge with the number of pending borrow requests
- Member sidebar shows a badge for unseen rejection notifications, which clears once viewed

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django, Django REST Framework |
| Auth | djangorestframework-simplejwt (custom auth class for members) |
| Payments | Stripe Checkout |
| Frontend | React 18, Vite, React Router |
| HTTP Client | Axios |
| Database | SQLite (default, swappable for PostgreSQL) |

---

## 📂 Project Structure

```
library/
├── frontend/
│   ├── backend/                 # Django project
│   │   ├── library/             # Project settings & root URLs
│   │   ├── manager/             # Admin-side app (books, members, borrow records, fees)
│   │   └── member/              # Member portal app (auth, browsing, requests, fees, payments)
│   └── frontend_new/            # React (Vite) app
│       └── src/
│           ├── pages/           # Admin pages
│           ├── pages/member/    # Member portal pages
│           └── components/      # Shared layout & route components
```

---

## ⚙️ Setup & Installation

### 1. Backend (Django)

```bash
cd library/frontend/backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

Create a `.env` file inside `backend/` (same folder as `manage.py`):

```
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

Then run migrations and start the server:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser   # create an admin login
python manage.py runserver
```

### 2. Frontend (React)

```bash
cd library/frontend/frontend_new
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### 3. Generating Monthly Fees

Fees for the current month can be generated in two ways:

- **Manually**, from the admin dashboard ("Generate This Month's Fees" button on the Fees page)
- **Automatically**, by scheduling the management command to run daily/monthly:

```bash
python manage.py generate_fees
```

Example cron entry (Linux server):
```
0 0 * * * cd /path/to/backend && python manage.py generate_fees
```

---

## 💳 Testing Payments

This project uses Stripe's **test mode**, so no real card or money is involved.

Use the following test card at checkout:

| Field | Value |
|---|---|
| Card number | `4242 4242 4242 4242` |
| Expiry | Any future date |
| CVC | Any 3 digits |



## 🚀 Possible Future Improvements

- Email notifications for due dates and payment confirmations
- Book reservation/waitlist system
- Admin analytics dashboard with charts
- Bulk import/export of books and members
- Deployment to Render/Railway (backend) and Vercel (frontend)
