# 💇‍♂️ SalonQ - Salon Appointment & Queue Management System

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

<div align="center">
  <h3>
    🔴 <strong><a href="https://salon-q-eight.vercel.app">View Live Demo Here</a></strong> 🔴
  </h3>
</div>

SalonQ is a robust, full-stack MERN application designed to modernize and streamline salon operations. It eliminates the hassle of traditional walk-in queues by offering a seamless online appointment booking system combined with real-time queue management for both customers and salon administrators.

---

## ✨ Comprehensive Features

### 👤 Customer Experience
* **Secure Authentication & Onboarding:** JWT-based user registration and login system.
* **Service Catalog:** Interactive menu to browse available salon services, durations, and pricing.
* **Frictionless Booking:** Date and time-slot selection for preferred services.
* **OTP Verification:** Enhanced security utilizing Email OTPs to verify valid user bookings.
* **Automated Email Notifications:** Users receive immediate booking confirmations, approval alerts, and appointment reminders.
* **Dashboard & History:** Dedicated customer portal to track current queue status, upcoming appointments, and past booking history.

### 🛠️ Administrator Dashboard
* **Secure Admin Portal:** Role-based access control ensuring only authorized personnel can manage the salon.
* **Dynamic Service Management:** Full CRUD (Create, Read, Update, Delete) interface to manage salon offerings dynamically.
* **Booking Moderation:** Ability to view incoming requests, and manually approve or reject customer bookings based on availability.
* **Live Queue & Token Management:** Issue walk-in tokens, manage booked tokens, and monitor the live queue flow in real-time.
* **Reporting & Analytics:** Generate insights into salon performance, daily footfall, and most popular services.

---

## 🔄 System Workflow

### How it Works for Customers
1. **Sign Up/Login:** User creates an account and logs in securely.
2. **Select Service:** User browses the catalog and selects a desired service (e.g., Haircut, Spa).
3. **Book Appointment:** User selects a convenient date and submits a booking request.
4. **OTP Verification:** User verifies their email address via an OTP sent to their inbox.
5. **Wait for Approval:** The booking goes into a "Pending" state until the admin reviews it.
6. **Confirmation & Reminders:** Once approved, the user receives an email confirmation and gets a reminder on the day of the appointment.

### How it Works for Admins
1. **Login:** Admin logs into the secure dashboard.
2. **Review Requests:** Admin checks pending booking requests and accepts/rejects them.
3. **Queue Management:** Admin updates the status of the current customer (e.g., "In Progress", "Completed").
4. **Manage Services:** Admin adds new services or updates pricing as needed.

---

## 🏗️ Detailed Tech Stack

### Frontend
* **React.js (Vite):** Lightning-fast build tool and frontend framework.
* **React Router DOM:** For seamless Single Page Application (SPA) navigation.
* **Axios:** For handling RESTful API requests to the backend.
* **CSS:** For responsive and modern UI design.

### Backend
* **Node.js & Express.js:** Scalable backend server infrastructure.
* **MongoDB & Mongoose:** NoSQL database and Object Data Modeling (ODM) library for flexible data storage.
* **JSON Web Tokens (JWT) & bcryptjs:** Secure password hashing and stateless authentication.
* **Nodemailer:** For reliable transactional email delivery (OTPs, confirmations).
* **node-cron:** To schedule automated tasks like sending daily appointment reminders or clearing old bookings.

---

## 🚀 Getting Started Locally

Follow these instructions to set up the development environment on your local machine.

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
* A valid Email account configured for SMTP access.

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd salon-queue-mern
```

### 2. Environment Variables Configuration

Navigate to the `server` directory and create a `.env` file:

```bash
cd server
cp .env.example .env
```

Open `.env` and add your specific configuration:
```env
# Database & Security
MONGO_URI=mongodb://127.0.0.1:27017/salon_queue
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173

# Email Service Configuration (Required for OTP & Reminders)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_app_password
FROM_EMAIL="Salon Queue <youremail@gmail.com>"
```

### 3. Install & Run the Application

You need to run both the backend API and the frontend client concurrently.

**Backend Server**
Open a terminal and execute:
```bash
cd server
npm install
npm run dev # Runs nodemon server on http://localhost:5000
```

**Frontend Client**
Open a new terminal window and execute:
```bash
cd client
npm install
npm run dev # Runs Vite development server on http://localhost:5173
```

---

## 📂 Project Structure

```text
salon-queue-mern/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page views (Home, Dashboard, Book)
│   │   ├── context/        # React Context for state management
│   │   └── App.jsx         # Main React component
│   └── package.json        # Frontend dependencies
├── server/                 # Backend Node/Express API
│   ├── config/             # DB connection and setup
│   ├── models/             # Mongoose schemas (User, Booking, Service)
│   ├── routes/             # API Endpoints (authRoutes, bookingRoutes)
│   ├── middleware/         # Auth verification and error handling
│   ├── utils/              # Email transporter, cron jobs
│   └── package.json        # Backend dependencies
└── README.md               # Documentation
```

---

## 👨‍💻 Author

**Chinthan Rai Kukkuvalli**  

---
*If you like this project or find it helpful, please consider giving it a ⭐!*
