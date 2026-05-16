<div align="center">
  <div style="background: linear-gradient(to right, #2563eb, #4f46e5); border-radius: 20px; padding: 20px; display: inline-block;">
    <h1 style="color: white; margin: 0; font-size: 3em;">GigFlow</h1>
  </div>
  
  <br />
  <p><b>A Highly Polished, Modern Lead Management Dashboard</b></p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
</div>

<br />

> GigFlow is designed to streamline your sales workflows. Built with the full MERN stack, it features a sleek glassmorphism UI, robust Role-Based Access Control (RBAC), and reliable data integrity mechanisms to keep your pipeline completely duplicate-free.

---

## ✨ Features at a Glance

| Feature | Description |
| :--- | :--- |
| 🎨 **High-Fidelity Dashboard** | Responsive UI built with Tailwind CSS, featuring subtle gradients, glassmorphism overlays, and beautiful custom dropdowns. |
| 🔐 **Strict RBAC** | Granular permissions dividing `Admin` and `Sales` users. Only Admins can delete records, export data, and perform bulk imports. |
| 🔄 **Robust CRUD** | Create, Read, Update, and Delete leads seamlessly using custom animated modal interfaces. |
| 📄 **Smart CSV Handling** | Import large lists of leads via CSV with fault-tolerant deduplication. Export existing pipelines into standard CSV formats. |
| ⚡ **Real-Time Data** | Instantaneous data fetching, debounce-optimized text search, status filters, source filters, and chronological sorting. |
| 📱 **Optimized UX** | Dynamic collapsible side navbar, CSS-powered tooltips, and elegant toast notifications. |

---

## 🛠️ Technology Stack

<details>
<summary><b>🖥️ Frontend</b></summary>
<br>

The frontend is a blazing-fast Single Page Application (SPA) utilizing modern React patterns.

* **Framework:** React + Vite
* **Styling:** Tailwind CSS (configured for Dark/Light mode and Glassmorphism)
* **State Management:** Zustand (Auth, Theme, and Lead states)
* **Icons:** Lucide-React
* **API Comms:** Axios with automatic JWT interceptors
</details>

<details>
<summary><b>⚙️ Backend</b></summary>
<br>

The backend is a secure, RESTful Node.js API.

* **Framework:** Express.js + TypeScript
* **Database:** MongoDB + Mongoose ODM (enforcing email uniqueness)
* **Authentication:** JWT (JSON Web Tokens) + Bcrypt hashing
* **Security:** Cors, Helmet, and custom role-validation middlewares
</details>

---

## 🔑 Environment Variables

To run this project locally, you must create `.env` files in both the `frontend` and `backend` directories.

### Backend (`/backend/.env`)

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database Connection
# Replace with your MongoDB Atlas connection string or local instance
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/gigflow

# Authentication Secrets
JWT_SECRET=your_super_secret_jwt_signature_key_here
JWT_EXPIRES_IN=30d
```

### Frontend (`/frontend/.env`)

```env
# API Connection
# Points to your backend server's endpoint
VITE_API_URL=http://localhost:8000/api/v1
```

---

## 🚀 Quick Start Guide

Follow these steps to get GigFlow running on your local machine:

### 1. Clone & Install
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment
Create the `.env` files in their respective folders as described in the section above.

### 3. Seed the Database
*To test the Admin functionality (Imports/Exports/Deletes), you need an Admin account.*
```bash
cd backend
npx ts-node seed_admin.ts
```
> **Note:** This automatically creates a demo admin at `admin@gigflow.com` with the password `password123`.

### 4. Start the Application
You need to run both the backend and frontend servers simultaneously. Open two terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### 5. View the App 🎉
Open your browser and navigate to `http://localhost:5173`. 
Click the **"Fill Admin Demo Info"** button on the login screen to dive right into the Admin view!

---
<div align="center">
  <i>Built with ❤️ for efficient pipeline management.</i>
</div>
