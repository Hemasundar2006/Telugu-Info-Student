# Telugu Info Student – React Frontend

A modern, responsive React frontend for the Telugu Info Student Backend – an educational platform for Andhra Pradesh & Telangana students.

## Backend API

- **Base URL:** `https://telugu-info-student-backend-hqdd.onrender.com`

## Tech Stack

- **React** 18 with functional components and hooks
- **Vite** for build and dev server
- **React Router v6** for routing
- **Context API** for auth state
- **React Hook Form + Yup** for forms and validation
- **Axios** for API calls
- **Recharts** for activity charts
- **react-dropzone** for file uploads
- **react-hot-toast** for notifications
- **date-fns** for dates

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run development server**

   ```bash
   npm run dev
   ```

   Open the URL shown (e.g. `http://localhost:5173`).

3. **Build for production**

   ```bash
   npm run build
   ```

4. **Preview production build**

   ```bash
   npm run preview
   ```

## Features

- **Authentication:** Login (email+password or phone), Register, JWT in localStorage
- **Role-based UI:** USER, SUPPORT, ADMIN, SUPER_ADMIN with different nav and pages
- **Documents:** List approved docs, upload (Support/Admin), pending list & approve (Super Admin), My Uploads
- **Tickets:** Create (User), My Tickets, Support list with Assign/Complete, Completed list (Super Admin)
- **Activities:** Dashboard with filters, Activity Statistics with charts, User activity detail
- **College Predictor:** Rank, category, state, optional district → list of colleges with cutoffs
- **Profile:** View name, email, phone, role, state, tier
- **Protected routes** and **Unauthorized** page

## Project Structure

```
src/
├── api/           # config, auth, documents, tickets, activities, predictor
├── components/    # ProtectedRoute, Layout (Header, Sidebar)
├── context/       # AuthContext
├── pages/         # Login, Register, Dashboard, Documents, Tickets, Activities, Predictor, Profile
├── routes/        # AppRoutes
├── utils/         # constants, errorHandler
├── App.jsx
├── main.jsx
└── index.css
```

## Environment

The API base URL is set in `src/api/config.js`. To use a different backend, change the `baseURL` there.

## Roles & Access

| Role        | Main access                                              |
|------------|-----------------------------------------------------------|
| USER       | Documents, Create ticket, My tickets, College predictor  |
| SUPPORT    | Upload document, My uploads, Support tickets              |
| ADMIN      | Upload document, My uploads                               |
| SUPER_ADMIN| Pending/approve documents, Completed tickets, Activities  |

All authenticated users can view approved documents and use the college predictor.
