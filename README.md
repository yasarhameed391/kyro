# Kyro Build

AI-powered website generator with visual studio editor. Generate full-stack web projects from natural language descriptions, preview them, and edit visually with Kyro Studio.

## Features

- **AI Website Generation** - Describe your project and get a complete website generated
- **Authentication** - Secure JWT-based auth with signup/login
- **Project Management** - Dashboard to view and manage all your generated projects
- **Live Preview** - Preview generated projects before downloading
- **Download** - Download projects as ZIP files
- **Kyro Studio** - Visual editor to modify generated projects with file tree, code editor, and properties panel

## Tech Stack

### Frontend
- React 18 with TypeScript
- TailwindCSS for styling
- React Router DOM for routing
- Axios for API calls
- Vite as build tool

### Backend
- Express.js with Node.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Archiver for ZIP generation

### Architecture
- Turborepo monorepo
- Shared types package
- Kyro AI Engine (rule-based template generation)

## Project Structure

```
kyro/
├── apps/
│   ├── frontend/          # React frontend
│   │   └── src/
│   │       ├── App.tsx    # Main wizard component
│   │       ├── Login.tsx
│   │       ├── Signup.tsx
│   │       ├── Dashboard.tsx
│   │       ├── Preview.tsx
│   │       └── Studio.tsx # Visual editor
│   └── backend/           # Express backend
│       ├── src/
│       │   └── index.js   # Main server file
│       └── generated-projects/
├── packages/
│   ├── shared/            # Shared TypeScript types
│   └── kyro-ai/           # AI generation engine
└── turbo.json
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yasarhameed391/kyro.git
cd kyro
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create `apps/backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/kyro
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=3001
```

4. Start MongoDB (if running locally):
```bash
mongod
```

## Running the App

### Development Mode

Start all services with Turborepo:
```bash
npm run dev
```

Or start individually:

**Backend:**
```bash
cd apps/backend
node src/index.js
```
Runs on `http://localhost:3001`

**Frontend:**
```bash
cd apps/frontend
npm run dev
```
Runs on `http://localhost:3000`

### Production Build
```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Projects
- `POST /api/generate` - Generate a new project (auth required)
- `GET /api/projects` - List all user projects (auth required)
- `GET /api/project/:projectId` - Get project details (auth required)
- `GET /api/project/:projectId/file?path=<path>` - Read file content (auth required)
- `POST /api/project/:projectId/update` - Update file content (auth required)
- `GET /api/download/:projectId` - Download project as ZIP
- `GET /api/preview/:projectId` - Preview project

### Documentation
- Swagger docs available at `http://localhost:3001/api-docs/`

## Usage Flow

1. **Sign up** - Create an account at `/signup`
2. **Login** - Access your account at `/login`
3. **Generate** - Use the wizard to describe your project:
   - Enter project name
   - Select website type (portfolio, ecommerce, blog, dashboard, landing)
   - Choose features (auth, admin, payments, blog, search, dark mode)
   - Add custom modules
4. **Dashboard** - View all your generated projects
5. **Preview** - Preview any project before downloading
6. **Studio** - Open any project in Kyro Studio to visually edit files
7. **Download** - Download the finished project as a ZIP file

## Kyro Studio

The visual editor provides:
- **Left Panel** - File tree navigation
- **Center Panel** - Code editor with syntax display
- **Right Panel** - File properties
- Save changes directly to the project
- Download edited projects

## Environment Variables

### Backend (`apps/backend/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/kyro` |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `PORT` | Backend server port | `3001` |

## License

MIT

## Author

**Yasar Hameed**

Developed by Yasar Hameed
