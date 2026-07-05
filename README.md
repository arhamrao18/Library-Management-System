# Stacks — Library Manager (React Frontend)

React frontend for the Manager/Admin side of your Library Management System,
built to consume a Django REST Framework API instead of Django templates.

## Pages Included (Manager Portal)
- Login (Token authentication)
- Books — list, search, add, delete
- Members — list, search, add, remove
- Borrow Requests — pending requests, approve
- Borrowed — currently checked-out books
- Returns — return requests, confirm return

> Note: The Student/Member portal (separate login, browse & request books) is
> not included yet — this covers the Manager side first. Ask if you'd like
> the Member portal built next.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the dev server:
```bash
npm run dev
```
This runs on `http://localhost:5173` by default.

3. Make sure your Django backend is running with the API routes and CORS
   configured (see the backend code provided separately), and that you have
   a Django superuser created:
```bash
python manage.py createsuperuser
```

4. Open `http://localhost:5173`, log in with your superuser credentials.
   If your Django API runs on a different host/port, update the "API base URL"
   field on the login page — it's saved automatically.

## Notes
- Auth token is stored in `localStorage` and attached to every API request.
- Image uploads (book covers, member photos) are sent as `multipart/form-data`.
- If a request gets a 401 (invalid/expired token), you're redirected to login automatically.
