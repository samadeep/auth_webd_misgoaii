# TaskPal - Task Management Application

TaskPal is a full-stack task management application built with React, TypeScript, Node.js, Express, and MongoDB. It provides a modern and intuitive interface for managing tasks with features like priority management, due dates, and task reordering.

## Features

- 🔐 User Authentication (Register/Login)
- ✅ Task Management (Create, Read, Update, Delete)
- 📅 Due Date Management
- ⭐ Priority Levels
- 🔄 Task Reordering
- 🎯 Top Priority Tasks View
- 📱 Responsive Design
- 🔒 JWT Authentication
- 🎨 Material-UI Components

## Tech Stack

### Frontend
- React
- TypeScript
- Material-UI
- Axios
- React Router
- @mui/x-date-pickers
- date-fns

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taskpal
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Configuration

### Backend Setup

1. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskpal
JWT_SECRET=your_jwt_secret_here
```

For MongoDB Atlas:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskpal?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

### Frontend Setup

1. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Tasks
- GET `/api/tasks` - Get all tasks
- POST `/api/tasks` - Create a new task
- GET `/api/tasks/:id` - Get a specific task
- PATCH `/api/tasks/:id` - Update a task
- DELETE `/api/tasks/:id` - Delete a task
- GET `/api/tasks/top` - Get top priority tasks
- POST `/api/tasks/reorder` - Reorder tasks

## Project Structure

```
taskpal/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── services/
    │   ├── types/
    │   ├── App.tsx
    │   └── index.tsx
    ├── package.json
    └── tsconfig.json
```

## Development

### Backend Development
- TypeScript configuration is in `backend/tsconfig.json`
- Development server runs on port 5000
- Uses nodemon for automatic reloading

### Frontend Development
- TypeScript configuration is in `frontend/tsconfig.json`
- Development server runs on port 3000
- Uses Create React App with TypeScript template

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers. 