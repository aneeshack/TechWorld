# 🎓 TechWorld (E-Learning Platform)

Welcome to the **TechWorld Platform** – a modern web application that enables **students**, **instructors**, and **admins** to engage in a digital learning environment. It includes course management, real-time chat, and a purchase system for courses.

---

## 🌐 Live Demo
🔗 https://t-learning.shop/


## 🚀 Overview

An intuitive MERN-based E-Learning platform supporting:
- 👨‍🎓 **Students**: Browse, purchase, and enroll in courses + chat with instructors.
- 👩‍🏫 **Instructors**: Create and manage courses, communicate with enrolled students.
- 🛡️ **Admins**: Manage categories and track platform-level metrics.

---

## 🧩 Features by Role

### 👨‍🎓 Student
- Register/Login using JWT
- Browse all available courses
- Purchase courses
- View enrolled courses
- Chat with instructors after enrolling

### 👩‍🏫 Instructor
- Add & manage courses
- Upload content (videos, descriptions, etc.)
- Receive messages from students
- Respond via chat interface

### 🛡️ Admin
- Add/manage course categories
- Dashboard showing:
  - Total purchases
  - Revenue stats
  - Total users/courses

### 💬 Chat System
- Students can initiate a chat with instructors of **purchased** courses
- Real-time-like messaging for seamless communication

---

## 🧰 Tech Stack

| Layer       | Technology                         |
|-------------|-------------------------------------|
| Frontend    | React.js, Axios, Tailwind |
| Backend     | Node.js, Express.js                 |
| Database    | MongoDB with Mongoose               |
| Authentication | JWT, bcrypt                      |
| File Upload | S3 Bucket, Cloudinary       |
| Chat        | REST APIs or Socket.io     |
| Hosting     | vercel (Frontend), GCP (Backend)|

---

---

## ⚙️ Getting Started (Local Setup)

### 📁 Clone Repository
```bash
git clone https://github.com/aneeshack/TechWorld.git
cd TechWorld

📦 Backend Setup
bash
cd backEnd
npm install

➕ Create .env in /backend
fill full env credentials

MONGODB_URI=
HOST=
PORT=
FRONTEND_URL=http://localhost:5173
SMTP_MAIL=
SMTP_PASSWORD=
SMTP_PORT=
JWT_SECRET=
REFRESH_SECRET=
NODE_ENV=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_S3_BUCKET_NAME=
AWS_REGION=
STRIPE_SECRET_KEY=


Run backend:
bash
npm run dev

 Frontend Setup
cd ../frontEnd
npm install

➕ Create .env in /frontend

VITE_BACKEND_API_URL =
VITE_CLOUDINARY_UPLOAD_PRESET = 
VITE_CLOUDINARY_CLOUD_NAME = 
VITE_CLIENT_ID =
VITE_STRIPE_PUBLISHABLE_KEY=

Run frontend:
npm run dev

🌍 Local URLs
Frontend: http://localhost:5173
Backend: http://localhost:8000


🙋‍♀️ Author
Made with ❤️ by Aneesha
🔗 GitHub: https://github.com/aneeshack
🔗 LinkedIn: www.linkedin.com/in/aneesha-ck-mern-developer
