# HelpWise AI Chatbot Frontend

## Overview
This is the frontend application for the HelpWise AI Chatbot, built with React and Vite. It provides a modern, responsive interface for interacting with the AI chatbot.

## Features
- User authentication (login/signup)
- Real-time chat interface
- Dark mode support
- Chat history management
- Responsive design
- Modern UI with animations

## Tech Stack
- React 18.2.0
- Vite
- TailwindCSS
- Framer Motion
- React Router DOM
- Axios
- React Hot Toast

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server running

## Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure
```
src/
├── Components/     # Reusable UI components
├── Pages/         # Page components
│   ├── Authentication/  # Login/Signup pages
│   └── ChatbotApp.jsx  # Main chat interface
├── services/      # API services
├── assets/        # Static assets
├── App.jsx        # Root component
└── main.jsx      # Entry point
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Development Guidelines
- Follow the existing code style and conventions
- Use TailwindCSS for styling
- Implement responsive design
- Add proper error handling
- Use React hooks appropriately
- Follow component composition patterns

## Contributing
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License
MIT
