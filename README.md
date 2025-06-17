# AI Chatbot Application

A full-stack AI chatbot application with authentication, real-time chat functionality, and a modern user interface.

## Features

### Frontend Features
- Modern, responsive UI built with React and Tailwind CSS
- Real-time chat interface with message history
- Dark/Light mode toggle
- User authentication (Login/Signup)
- Protected routes for authenticated users
- Toast notifications for user feedback
- Loading states and error handling

### Backend Features
- RESTful API built with Express.js
- JWT-based authentication
- MongoDB database integration
- Chat history management
- Secure password hashing
- Input validation and sanitization
- Error handling middleware

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion
- Axios
- React Router DOM
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- JSON Web Token (JWT)
- Bcrypt.js
- Mongoose

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd chatbot-2
```

2. Set up the backend:
```bash
cd backend
npm install

# Create .env file with the following variables:
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000

# Start the server
npm start
```

3. Set up the frontend:
```bash
cd frontend
npm install

# Create .env file with:
VITE_API_URL=http://localhost:5000

# Start the development server
npm run dev
```

## Project Structure

```
├── frontend/                # Frontend React application
│   ├── src/
│   │   ├── Components/     # Reusable UI components
│   │   ├── Pages/          # Page components
│   │   ├── services/       # API services
│   │   └── assets/         # Static assets
│   └── public/             # Public assets
│
└── backend/                # Backend Node.js application
    ├── controllers/        # Request handlers
    ├── middleware/         # Custom middleware
    ├── models/             # Database models
    └── routes/             # API routes
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Chat
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/message` - Send a message
- `DELETE /api/chat/:id` - Delete a chat
- `DELETE /api/chat/clear` - Clear chat history

## Development Guidelines

1. Code Style
   - Follow consistent naming conventions
   - Use meaningful variable and function names
   - Add comments for complex logic
   - Follow ESLint and Prettier configurations

2. Git Workflow
   - Create feature branches from main
   - Write clear commit messages
   - Review code before merging

3. Testing
   - Write unit tests for critical functionality
   - Test API endpoints with Postman/Insomnia
   - Perform manual testing before deployment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

- JWT for authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Protected routes
- Environment variables for sensitive data

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.