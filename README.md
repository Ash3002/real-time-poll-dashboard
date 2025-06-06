# Real-Time Poll Dashboard

[![Run Locally](https://img.shields.io/badge/Run-Locally-blue?style=for-the-badge&logo=github)](https://github.com/Ash3002/real-time-poll-dashboard#getting-started)

A full-stack polling application built with Next.js, Firebase, Tailwind CSS, Recharts, and Framer Motion.

## Features

- User authentication
- Admin interface for creating polls
- Voting interface for participants
- Real-time updates
- Responsive design
- Beautiful animations
- Deployed on Vercel

## Tech Stack

- Next.js (TypeScript)
- Firebase (Firestore, Auth)
- Tailwind CSS
- Recharts
- Framer Motion

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Git

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Ash3002/real-time-poll-dashboard.git
cd real-time-poll-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Get your Firebase configuration

4. Create a `.env.local` file in the root directory with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
├── context/         # Context providers
├── lib/             # Utility functions
└── types/           # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 