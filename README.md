# Flixora - Modern Movie Streaming & Cinema Ticket Booking Platform

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-API-008CDD?style=flat-square&logo=stripe&logoColor=white)

**Flixora** is a state-of-the-art, full-stack video streaming platform and multiplex cinema ticket booking web application. Built with Next.js 14 App Router, Express, and MongoDB, Flixora delivers an immersive cinema experience with real-time seat booking, instant Stripe payment processing, AI-powered recommendations, parental controls, and a feature-rich Super Admin Dashboard.

---

## Core Features

### 1. Movie & Anime Catalogue
- Integrated TMDB API for live data on trending movies, popular series, and anime.
- Advanced filtering by genre, rating, release year, and language.

### 2. Interactive Cinema Seat Booking
- Interactive multiplex cinema seat layout with real-time seat selection.
- Automatic price calculation based on seat category and movie session.

### 3. Stripe Payment & Subscription Management
- Secure checkout via Stripe API for subscription plans (Basic, Standard, Premium).
- Instant invoice generation, transaction history, and direct online refunds.

### 4. Parental Control & Kids Mode
- Dedicated PIN-protected Kids profile area with age-appropriate content filters.
- Seamless profile switching between user modes.

### 5. Flixora AI Assistant & Chatbot
- Smart AI chatbot integrated with Gemini AI for movie discovery, recommendations, and assistance.

### 6. Comprehensive Admin Dashboard
- Complete management interface for catalogue, revenue analytics, user accounts, job applications, contact messages, and Stripe refunds.

---

## Screenshots & Previews

### Home Page
![Flixora Home Page](./public/readme-file-image/Home-page.png)

### Movie Details & Streaming
![Movie Details Page](./public/readme-file-image/details-page.png)

### Cinema Seat Selector
![Cinema Seat Selection](./public/readme-file-image/seat.webp)

### Super Admin Dashboard
![Admin Dashboard](./public/readme-file-image/admin-dashboard.png)

---

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend**: Node.js, Express.js, Mongoose, Better-Auth / Session Auth
- **Database**: MongoDB Atlas
- **Payments**: Stripe Checkout & Payment Intents API
- **AI & External APIs**: TMDB API, Google Gemini AI, ImgBB API

---

## Getting Started

### 1. Prerequisites
- Node.js `v18+` or `v20+`
- npm, yarn, or pnpm
- MongoDB Atlas Database URI

### 2. Installation & Setup
```bash
# Clone the repository
git clone https://github.com/Zabedfolio/Flixora-Client.git

# Navigate to client directory
cd Flixora-Client

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Environment Variables Setup
Create a `.env.local` file in `Flixora-Client` with the following:
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
IMGBB_API_KEY=your_imgbb_api_key
```

---

## Team Members

We are a team of 6 developers collaborating to build **Flixora**:

| Member | Role | GitHub Profile |
| :--- | :--- | :--- |
| **Zabed Mahmud** | **Team Leader** | [![GitHub](https://img.shields.io/badge/GitHub-Zabedfolio-181717?style=flat-square&logo=github)](https://github.com/Zabedfolio) |
| **Anuj Paul** | Core Developer | [![GitHub](https://img.shields.io/badge/GitHub-anujpaul27-181717?style=flat-square&logo=github)](https://github.com/anujpaul27) |
| **Sraboni Sarkar** | Core Developer | [![GitHub](https://img.shields.io/badge/GitHub-sraboni47-181717?style=flat-square&logo=github)](https://github.com/sraboni47) |
| **Md Sohan** | Core Developer | [![GitHub](https://img.shields.io/badge/GitHub-islammdsohan603-181717?style=flat-square&logo=github)](https://github.com/islammdsohan603) |
| **Sheikh Muzammil** | Core Developer | [![GitHub](https://img.shields.io/badge/GitHub-sheikh--muzammil2026-181717?style=flat-square&logo=github)](https://github.com/sheikh-muzammil2026) |
| **Tahiya Akter** | Core Developer | [![GitHub](https://img.shields.io/badge/GitHub-tahiyaakter94-181717?style=flat-square&logo=github)](https://github.com/tahiyaakter94) |

---

## License

This project is open source and available under the [MIT License](LICENSE).
