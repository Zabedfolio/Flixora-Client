# Flixora — Hybrid Movie Streaming & Cinema Ticket Booking Platform

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?style=flat-square&logo=stripe&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-8E75B2?style=flat-square&logo=google&logoColor=white)

**Flixora** is a state-of-the-art hybrid entertainment platform that unifies **Subscription Video on Demand (SVOD)** streaming with **Physical Cinema Hall Ticket Reservations**. Built with Next.js 14 App Router, Express.js, and MongoDB, Flixora offers real-time seat locking, instant Stripe payment processing, automated PDF ticket pass creation, staff QR scanning verification, PIN-protected parental controls, and an intelligent AI cinema assistant.

---

## 👥 Development Team

| Member Name | Project Role | GitHub Profile |
| :--- | :--- | :--- |
| **Zabed Mahmud** | **Team Leader** | [![GitHub](https://img.shields.io/badge/GitHub-Zabedfolio-181717?style=flat-square&logo=github)](https://github.com/Zabedfolio) |
| **Anuj Paul** | Core Developer | [![GitHub](https://img.shields.io/badge/GitHub-anujpaul27-181717?style=flat-square&logo=github)](https://github.com/anujpaul27) |
| **Sraboni Sarkar** | Core Developer | [![GitHub](https://img.shields.io/badge/GitHub-sraboni47-181717?style=flat-square&logo=github)](https://github.com/sraboni47) |
| **Md Sohan** | Core Developer | [![GitHub](https://img.shields.io/badge/GitHub-islammdsohan603-181717?style=flat-square&logo=github)](https://github.com/islammdsohan603) |
| **Sheikh Muzammil** | Core Developer | [![GitHub](https://img.shields.io/badge/GitHub-sheikh--muzammil2026-181717?style=flat-square&logo=github)](https://github.com/sheikh-muzammil2026) |
| **Tahiya Akter** | Core Developer | [![GitHub](https://img.shields.io/badge/GitHub-tahiyaakter94-181717?style=flat-square&logo=github)](https://github.com/tahiyaakter94) |

---

## 🌟 Unique Selling Propositions (USPs)

- **Dual-Model Hybrid Ecosystem**: Eliminates the boundary between home streaming and multiplex theater attendance by serving both streaming subscribers and cinema ticket buyers in one platform.
- **Real-Time Parabolic Seat Reservation & 10-Min Holding Engine**: Prevents double-booking conflicts across cinema halls by using a dynamic temporary seat-locking engine with auto-expiring timers.
- **Digital PDF Pass & Staff Gate QR Verification**: Generates printable PDF entry passes containing high-density QR codes that multiplex staff can scan to verify or mark tickets as used.
- **Flixora AI Concierge**: Powered by Google Gemini AI, offering natural language movie discovery, recommendation queries, trivia responses, and navigation support.
- **PIN-Protected Kids Mode & Parental Controls**: Comprehensive content isolation featuring age-rating filters and secure 4-digit PIN locks to protect younger viewers.

---

## 🚀 Key Features

### 🎬 1. Movie & Series Streaming Hub
- Live catalogue powered by TMDB API featuring trending movies, top series, and anime.
- Custom watchlists, watch history tracking, and mood-based playlist creation.
- Seamless video player with multi-resolution streaming support.

### 🎟️ 2. Multiplex Cinema Ticket Booking
- Dynamic cinema hall selector supporting multiple cities and theater locations (Star Cineplex, Blockbuster Cinemas, Lion Cinema, Silver Screen).
- Curved parabolic seat map layout with real-time seat status indicators (Available, Selected, Reserved, Booked).
- Multi-seat selection with automatic price breakdown per tier.

### 💳 3. Stripe Payments & User Subscription Engine
- Secure Stripe Checkout integration supporting subscription tiers (**Basic**, **Standard**, **Premium**).
- Automated receipt generation, transaction logging, and user billing dashboard.
- Full support for digital ticket pass retrieval under **My Bookings**.

### 🛡️ 4. Parental Controls & Kids Mode
- Isolated **Kids Mode** profile UI with strict age-rating filters.
- Restricted access to ticket booking and billing pages while in Kids Mode.
- PIN-protected exit mechanism ensuring parental oversight.

### 🤖 5. Flixora AI Assistant
- Integrated AI conversational widget for personalized recommendations, movie summaries, and assistance.
- Fast, context-aware responses tailored to movie titles and showtimes.

### 📊 6. Super Admin Management Console
- Centralized administration dashboard for revenue analytics, transaction audits, subscriber counts, and application reviews.
- Real-time management of cinema showtimes, promo codes, user roles, content reviews, and support messages.

---

## 🖼️ Application Screenshots

### 🏠 Home Streaming Platform
![Flixora Home Page](./public/readme-file-image/Home-page.png)

### 📽️ Movie Details & Video View
![Movie Details Page](./public/readme-file-image/details-page.png)

### 🎟️ Multiplex Cinema Seat Booking Map
![Cinema Seat Selection](./public/readme-file-image/seat.webp)

### 📈 Super Admin Dashboard & Analytics
![Admin Dashboard](./public/readme-file-image/admin-dashboard.png)

---

## 🛠️ Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling & UI** | Tailwind CSS, Lucide Icons, Framer Motion |
| **Backend & APIs** | Node.js, Express.js, Next.js Server Routes, Mongoose |
| **Database** | MongoDB Atlas |
| **Authentication** | Better-Auth / Session Auth, Next.js Middleware |
| **Payments** | Stripe Checkout & Payment Intents API |
| **PDF & QR Code** | `@react-pdf/renderer`, `qrcode.react`, `qrcode` |
| **External APIs** | TMDB API, Google Gemini AI API, ImgBB API |

---

## ⚙️ Getting Started & Installation

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **yarn**
- **MongoDB Atlas** database connection string

### 2. Repository Setup
```bash
# Clone the client repository
git clone https://github.com/Zabedfolio/Flixora-Client.git

# Navigate into project directory
cd Flixora-Client

# Install required dependencies
npm install
```

### 3. Environment Variables Configuration
Create a `.env` or `.env.local` file in the root of `Flixora-Client`:

```env
# Next.js Server & Public URL
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000

# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/Flixora

# Stripe Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# AI & Media APIs
GEMINI_API_KEY=your_gemini_api_key
IMGBB_API_KEY=your_imgbb_api_key
```

### 4. Running Locally
```bash
# Start Next.js client development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
