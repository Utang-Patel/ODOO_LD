# ✈️ GlobeTrotter — Smart Multi-City Travel Planner

**GlobeTrotter** is a modern, full-stack travel planning platform built for the **Odoo Hackathon**. It simplifies multi-city trip creation, city and activity discovery, budget calculation, calendar timeline visualization, public itinerary sharing, and admin analytics.

---

## ✨ Key Features

- **🛡️ Authentication & Password Reset**: Secure signup/login with JWT, bcrypt hashing, interactive password reset, and role-based access.
- **📊 Interactive Dashboard**: Summary metrics, quick action cards, and personal trip highlights.
- **✈️ Trip & Itinerary Builder**: Create multi-city trips with date ranges, preset or custom covers, budget limits (INR ₹), and day-wise activity scheduling.
- **🔍 City & Activity Discovery**: Real-time search, region & category filters, and saved destination favorites.
- **💰 Smart Budget Tracking**: Automatic expense calculations, daily cost averages, budget alert banners, and category doughnut charts.
- **📅 Travel Calendar & Timeline**: Expandable day-by-day vertical timelines and interactive month grid scheduling.
- **🌐 Public Trip Sharing**: Public URL generation with read-only views and "Save to My Trips" cloning.
- **🛡️ Admin Analytics Panel**: System-wide platform metrics, popular destination bar charts, user management directory, and trip streams.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Bootstrap 5, Custom SaaS Dark Glassmorphism CSS, Chart.js
- **Backend**: Node.js, Express.js, Sequelize ORM
- **Database**: MySQL (`globetrotter_db`)
- **Authentication**: JWT & bcrypt

---

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3001`*

---

## 🔑 Default Administrator Credentials

- **Email**: `admin@gmail.com`
- **Password**: `Admin@Admin`
