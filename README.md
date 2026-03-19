# 💪 FitStack — AI-Powered Personal Fitness Platform

> Connect with certified personal trainers, generate AI-powered diet & workout plans, and achieve your fitness goals — all in one platform.

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Connect](#-connect-with-us)

---

## 🧠 About the Project

**FitStack** is a smart fitness platform that bridges the gap between users and certified personal trainers.

- 🤖 **AI-generated** personalized diet and workout plans for free users
- 💳 **Subscription-based** premium access with Stripe payments
- 🏋️ **Book personal trainers** and attend 1-to-1 live sessions
- 💬 **Real-time chat** with your selected trainer
- ⭐ **Rate & Review** trainers after sessions
- 💰 **Trainers earn 80%** of each session's subscription value

---

## 🚀 Features

### 👤 For Users

| Feature | Description |
|---|---|
| 🤖 AI Diet & Workout Plans | Free AI-generated personalized plans on signup |
| 💳 Subscription Plans | Unlock premium features via Stripe-powered payments |
| 🏋️ Trainer Listings | Browse and filter certified personal trainers |
| 📅 Slot Booking | Book available 1-to-1 session slots with trainers |
| 🎥 Live Sessions | Attend personal training sessions online |
| 💬 Chat | Real-time chat with your selected trainer |
| ⭐ Rate & Review | Share feedback after each session |

---

### 🏆 For Trainers

| Feature | Description |
|---|---|
| 👤 Profile Management | Keep profile updated to attract more users |
| 📅 Slot Management | Create and manage available session slots |
| 💬 Client Chat | Communicate with clients directly |
| 📈 Session Tracking | Track all client sessions and history |
| 💰 Payment Tracking | Earn 80% of each session's subscription value automatically |

---

## 🛠 Tech Stack

### 🖥 Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

### ⚙️ Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

### 🗄 Database
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

### 🔐 Auth & Payments
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)

### 📡 Real-time
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc)

### 🏗 Architecture
- Clean Architecture principles
- SOLID design principles
- Repository pattern

---

## 📁 Project Structure

```
FitStack/
│
├── client/                   # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux store
│   │   ├── hooks/            # Custom hooks
│   │   └── services/         # API service calls
│   └── package.json
│
├── server/                   # Node.js Backend
│   ├── src/
│   │   ├── domain/            # Entities & interfaces
│   │   ├── application/       # Use cases & business logic
│   │   ├── infrastructure/    # DB, external services
│   │   └── interfaceAdapters/ # Controllers & routes
│   └── package.json
│
└── README.md
```

---

## 🏁 Getting Started

### ✅ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

---

### 📦 Installation

**Step 1 — Clone the repository**

```bash
git clone https://github.com/ajmal7799/FitStack.git
cd FITSTACK
```

**Step 2 — Install dependencies**

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

**Step 3 — Setup environment variables**

```bash
# In server folder
cp .env.example .env

# In client folder
cp .env.example .env
```

Edit `.env` files with your own values. See [Environment Variables](#-environment-variables) section below.

**Step 4 — Run the application**

```bash
# Run backend (from server folder)
cd server
npm run dev

# Run frontend (from client folder)
cd client
npm run dev
```

**Step 5 — Open in browser**

```
Frontend  →  http://localhost:5173
Backend   →  http://localhost:3000
```

---

## 🔐 Environment Variables

### Backend `.env`

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI Service
AI_API_KEY=your_ai_api_key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 📞 Connect With Us

| | |
|---|---|
| 📧 **Email** | aju457159@gmail.com |
| 🐙 **GitHub** | [github.com/ajmal7799](https://github.com/ajmal7799) |
| 🌐 **Website** | https://www.fitstack.co.in |

---

<div align="center">

**⭐ If you like this project, please give it a star on GitHub! ⭐**

Made with ❤️ by Ajmal

</div>