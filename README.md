# UserMS - User Management System

A full-stack User Management System with authentication, role-based access control, task management, and AI-powered features.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌐 Live Demo

| Component | URL |
|-----------|-----|
| **Frontend** | [https://userms0.netlify.app](https://userms0.netlify.app) |
| **Backend API** | [https://backend-project-61k5.onrender.com](https://backend-project-61k5.onrender.com) |
| **API Health Check** | [https://backend-project-61k5.onrender.com/health](https://backend-project-61k5.onrender.com/health) |

## 📋 Project Overview & Purpose

UserMS is a comprehensive user management solution that provides:

- **User Authentication** - Secure signup/login with JWT tokens
- **Role-Based Access Control** - Admin and User roles with different permissions
- **Profile Management** - Users can view and edit their profiles
- **Admin Dashboard** - Admins can manage all users (CRUD operations)
- **Task Management** - Create, edit, delete, and filter tasks
- **AI-Powered Features** - Generate task summaries and tags using Gemini AI
- **Search & Filter** - Search tasks by title/description with status/priority filters

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Helmet | Security headers |
| CORS | Cross-origin resource sharing |
| Google Generative AI | AI summaries/tags |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| Vite | Build tool |
| React Router v6 | Client-side routing |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| Context API | State management |

### DevOps & Testing
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| GitHub Actions | CI/CD pipeline |
| Vitest | Frontend testing |
| Jest | Backend testing |
| MongoDB Memory Server | Test database |

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables (see below)

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running Both Together

From the root directory:

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev
```

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
# Server Configuration
NODE_ENV=                    # development, production, or test
PORT=                        # Server port (default: 5000)

# Database
MONGO_URI=                   # MongoDB connection string

# Authentication
JWT_SECRET=                  # Secret key for JWT tokens
JWT_EXPIRE=                  # Token expiration (e.g., 30d)

# AI Integration (Optional)
GEMINI_API_KEY=              # Google Gemini API key for AI features

# CORS (Optional)
CORS_ORIGIN=                 # Allowed origins (comma-separated)
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=                # Backend API URL (e.g., http://localhost:5000/api)
```

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker compose up --build

# Run in detached mode
docker compose up -d --build

# Stop services
docker compose down
```

### Docker Configuration

The project includes:
- `Dockerfile` for backend
- `frontend/Dockerfile` for frontend
- `docker-compose.yml` for orchestration

### Environment for Docker

Create a `.env` file in the root directory with:

```env
MONGO_URI=mongodb://mongo:27017/userms
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
GEMINI_API_KEY=your-gemini-api-key
```

## ☁️ Cloud Deployment

This project is deployed using **Render** (backend) and **Netlify** (frontend).

### Backend Deployment on Render

**Live URL:** https://backend-project-61k5.onrender.com

#### Steps Taken:

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)
   - Connect GitHub account

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing the backend code

3. **Configure Build Settings**
   ```
   Name: backend-project
   Region: Oregon (US West)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Environment Variables**
   Add the following environment variables in Render dashboard:
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/userms
   JWT_SECRET=your-secure-jwt-secret-key
   JWT_EXPIRE=30d
   GEMINI_API_KEY=your-gemini-api-key
   CORS_ORIGIN=https://userms0.netlify.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for the build to complete
   - Verify deployment at `/health` endpoint

#### Render Configuration Notes:
- Free tier spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Automatic deploys on push to main branch

---

### Frontend Deployment on Netlify

**Live URL:** https://userms0.netlify.app

#### Steps Taken:

1. **Create Netlify Account**
   - Sign up at [netlify.com](https://netlify.com)
   - Connect GitHub account

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository

3. **Configure Build Settings**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

4. **Set Environment Variables**
   Go to Site settings → Environment variables → Add variable:
   ```
   VITE_API_URL=https://backend-project-61k5.onrender.com/api
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete
   - Access your site at the generated Netlify URL

6. **Custom Domain (Optional)**
   - Go to Domain settings
   - Add custom domain or use the default `.netlify.app` subdomain

#### Netlify Configuration Notes:
- Automatic deploys on push to main branch
- Deploy previews for pull requests
- Instant cache invalidation
- Free SSL certificate included

---

### Post-Deployment Checklist

- [x] Backend `/health` endpoint responds with status 200
- [x] Frontend loads without console errors
- [x] CORS configured to allow frontend domain
- [x] Environment variables set correctly on both platforms
- [x] User registration and login working
- [x] API calls from frontend reaching backend successfully

## 📖 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### User Endpoints

#### Get Current User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Updated",
  "email": "john.updated@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "fullName": "John Updated",
    "email": "john.updated@example.com",
    "role": "user"
  }
}
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/tasks?status=pending&priority=high&search=meeting
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status (pending, in-progress, completed) |
| priority | string | Filter by priority (low, medium, high) |
| search | string | Search in title and description |
| sort | string | Sort field (default: -createdAt) |

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "tasks": [
    {
      "_id": "...",
      "title": "Team Meeting",
      "description": "Weekly sync",
      "status": "pending",
      "priority": "high",
      "dueDate": "2025-01-15T00:00:00.000Z",
      "summary": "Attend weekly team sync meeting",
      "tags": ["meeting", "work"],
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete Project",
  "description": "Finish the user management system",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2025-01-31",
  "summary": "Complete the UserMS project",
  "tags": ["work", "coding"]
}
```

**Response (201):**
```json
{
  "success": true,
  "task": {
    "_id": "...",
    "title": "Complete Project",
    "description": "Finish the user management system",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2025-01-31T00:00:00.000Z",
    "summary": "Complete the UserMS project",
    "tags": ["work", "coding"],
    "user": "...",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

**Response (200):**
```json
{
  "success": true,
  "task": {
    "_id": "...",
    "title": "Complete Project",
    "status": "completed",
    ...
  }
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

#### Get Task Stats
```http
GET /api/tasks/stats
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "total": 10,
    "pending": 3,
    "in-progress": 4,
    "completed": 3
  }
}
```

### AI Endpoints

#### Generate AI Summary & Tags
```http
POST /api/ai/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Review code changes",
  "description": "Review the pull request for the new feature"
}
```

**Response (200):**
```json
{
  "success": true,
  "summary": "Review and approve PR for new feature implementation",
  "tags": ["review", "coding", "development"]
}
```

### Admin Endpoints

#### Get All Users (Admin Only)
```http
GET /api/admin/users
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "users": [
    {
      "_id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Update User (Admin Only)
```http
PUT /api/admin/users/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "role": "admin"
}
```

#### Delete User (Admin Only)
```http
DELETE /api/admin/users/:id
Authorization: Bearer <admin-token>
```

### Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common Status Codes:**
| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal server error |

## 🧪 Testing

### Run Backend Tests

```bash
cd backend
npm test
```

### Run Frontend Tests

```bash
cd frontend
npm test
```

### Run All Tests

```bash
npm test
```

## 📁 Project Structure

```
UserMS/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── validation.js
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── geminiAI.js
│   │   └── generateToken.js
│   ├── tests/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── tests/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
