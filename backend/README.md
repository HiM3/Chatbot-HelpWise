# HelpWise AI Chatbot Backend

## Overview
This is the backend server for the HelpWise AI Chatbot, providing API endpoints for user authentication and chat functionality using OpenAI's GPT model.

## Features
- User authentication with JWT
- Chat history management
- Integration with OpenAI's GPT model
- MongoDB database integration
- Secure password hashing
- CORS protection
- Environment variable configuration

## Tech Stack
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- OpenAI API
- CORS

## Prerequisites
- Node.js (v14 or higher)
- MongoDB
- OpenAI API key

## Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure
```
├── controllers/    # Request handlers
│   ├── authController.js
│   └── chatController.js
├── middleware/    # Custom middleware
│   └── auth.js
├── models/        # Database models
│   └── User.js
├── routes/        # API routes
│   ├── auth.js
│   └── chat.js
└── server.js      # Entry point
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
  - Body: `{ username, email, password }`
- POST `/api/auth/login` - Login user
  - Body: `{ email, password }`

### Chat
- GET `/api/chat/history` - Get user's chat history
  - Headers: `Authorization: Bearer {token}`
- POST `/api/chat/message` - Send message and get AI response
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ message, chatId? }`
- DELETE `/api/chat/chat/:chatId` - Delete specific chat
  - Headers: `Authorization: Bearer {token}`
- DELETE `/api/chat/history` - Clear all chat history
  - Headers: `Authorization: Bearer {token}`

## Error Handling
The API returns appropriate HTTP status codes and error messages:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 500: Server Error

## Development Guidelines
- Follow RESTful API design principles
- Implement proper error handling
- Use async/await for asynchronous operations
- Keep controllers thin, move business logic to services
- Add input validation
- Follow security best practices

## Security Measures
- JWT for authentication
- Password hashing with bcrypt
- Environment variables for secrets
- CORS protection
- Input validation
- Error message sanitization

## Contributing
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License
MIT