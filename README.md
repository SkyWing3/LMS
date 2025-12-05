# Learning Management System (LMS)

This is a comprehensive Learning Management System built with a modern tech stack, featuring a Next.js monolithic frontend/backend and specialized NestJS microservices for handling file uploads and email notifications.

## 🏗 Architecture

The project follows a hybrid architecture:
*   **Core Application (Monorepo Root):** Built with **Next.js 15**, serving as both the frontend (React) and the Backend-For-Frontend (BFF) using Server Actions. It handles authentication, user management, course data, and grades.
*   **Database:** **SQLite** managed by **Prisma ORM**.
*   **Microservices:**
    *   **Email Service:** A **NestJS** application responsible for sending system notifications (welcome emails, grade updates, etc.).
    *   **Upload Service:** A **NestJS** application that handles file storage and serving.

## 🚀 Prerequisites

*   **Node.js** (v18 or higher recommended)
*   **npm** (Node Package Manager)

## 🛠 Installation & Setup

### 1. Core Application (Next.js)

Navigate to the root directory and install dependencies:

```bash
npm install
```

#### Database Setup

Initialize the SQLite database and populate it with initial data:

```bash
# Run migrations
npx prisma migrate dev

# Seed the database (creates default users)
npm run prisma:seed
```

### 2. Microservices

You need to install dependencies for each microservice independently.

**Email Service:**

```bash
cd microservices/email-service
npm install
cd ../..
```

**Upload Service:**

```bash
cd microservices/upload-service
npm install
cd ../..
```

## ⚙️ Configuration

### Core App (`.env`)

Create a `.env` file in the root directory if you need to override defaults.
*   `DATABASE_URL`: Defaults to `"file:./dev.db"` (configured in `schema.prisma`).
*   `EMAIL_SERVICE_URL`: URL of the running email service. Defaults to `http://localhost:3002` (Recommended).
*   `JWT_SECRET`: Secret used to sign the session cookie. Set a long random string in production.
*   `GOOGLE_CLIENT_ID`: OAuth client ID generated in the Google Cloud Console.
*   `GOOGLE_CLIENT_SECRET`: OAuth client secret that pairs with the client ID.

#### Google Sign-In Setup

1. In [Google Cloud Console](https://console.cloud.google.com), create an **OAuth 2.0 Client ID** (type: Web application).
2. Add `http://localhost:3000` (or your production origin) as an authorized JavaScript origin.
3. Add `http://localhost:3000/api/auth/google/callback` (or the production equivalent) as an authorized redirect URI.
4. Copy the generated **Client ID** and **Client Secret** into `.env` as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
5. Ensure that users’ institutional accounts already exist in Google Workspace, end with `@ucb.edu.bo`, **and** have a corresponding record en la base de datos del LMS. Solo esos usuarios podrán autorizarse con Google; no se crean cuentas nuevas automáticamente.

### Email Service Configuration

The Email Service runs on port `3000` by default, which conflicts with Next.js. **You must run it on a different port (e.g., 3002).**

You can configure it via environment variables or by passing the port when running.

## 🏃‍♂️ Running the Application

To run the full system, you need to start three separate processes (terminal windows).

### 1. Start Upload Service (Port 3001)

This service is hardcoded to run on port **3001**.

```bash
cd microservices/upload-service
npm run start:dev
```

### 2. Start Email Service (Port 3002)

Run this service on port **3002** to avoid conflicts.

```bash
cd microservices/email-service
PORT=3002 npm run start:dev
```

### 3. Start Core Application (Port 3000)

```bash
# Ensure you are in the root directory
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👤 Default Users (Seeded Data)

The `prisma/seed.ts` script creates the following default users for testing. 
**Password for all users:** `123456`

| Role | Email | Functionality |
| :--- | :--- | :--- |
| **Admin** | `admin@school.com` | Manage users, courses, and system settings. |
| **Teacher** | `teacher@school.com` | Create assignments, exams, and grade students. |
| **Student** | `student@school.com` | View courses, submit assignments, take exams. |

## 📁 Project Structure

```
/
├── app/                 # Next.js App Router (Frontend & BFF)
│   ├── actions/         # Server Actions (Backend Logic)
│   ├── (pages)          # UI Pages
│   └── ...
├── components/          # React UI Components
├── lib/                 # Shared utilities (Auth, Email, Logger)
├── microservices/       # Backend Microservices
│   ├── email-service/   # NestJS Emailer
│   └── upload-service/  # NestJS File Uploader
├── prisma/              # Database Schema & Seeding
└── public/              # Static Assets
```

## 🔑 Key Features

*   **Role-Based Access Control (RBAC):** distinct dashboards for Admins, Teachers, and Students.
*   **Course Management:** Create, edit, and manage courses and enrollments.
*   **Assessment System:**
    *   **Assignments:** File upload support.
    *   **Exams:** Question-based assessments with automatic grading support (in progress).
*   **Grading:** Teachers can grade submissions; Students can view their progress.
*   **Profile Management:** Users can update their personal details.
