# Finance Buddy

A mobile application for managing personal finances, tracking expenses, and monitoring financial goals.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (for backend)
- iOS Simulator (for Mac users) or Android Studio (for Android development)

## Project Structure

The project is split into two main parts:
- Backend (Node.js/Express server)
- Frontend (React Native mobile app)

```
finance-buddy/
├── backend/           # Backend server
│   ├── src/          # Source code
│   ├── config/       # Configuration files
│   └── package.json  # Backend dependencies
└── frontend/         # React Native mobile app
    ├── app/          # App screens and components
    ├── components/   # Reusable components
    └── package.json  # Frontend dependencies
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the backend server:
```bash
npm run dev
# or
yarn dev
```

The backend server will start on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the Expo development server:
```bash
npx expo start
```

4. Run on your preferred platform:
- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Scan the QR code with your phone's camera (iOS) or Expo Go app (Android) to run on your physical device

## Features

- User authentication (login/register)
- Dashboard with financial overview
- Transaction management
- Expense tracking
- Budget planning
- Multiple currency support
- Multi-language support
- Payment method management
- Financial reports and analytics

## Development

### Backend
- Node.js with Express
- MongoDB database
- JWT authentication
- RESTful API architecture

### Frontend
- React Native with Expo
- TypeScript
- React Navigation
- i18n for internationalization
- AsyncStorage for local data persistence

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 