TaskMaster Pro - GitHub README
Introduction
A collaborative, full-stack task management application built with the MERN stack and PostgreSQL. Manage boards, share tasks, receive invitations, and reset passwords—all in a seamless, modern UI.
Features
•	🔐 User authentication (JWT-based)
•	🧾 Create, update, delete tasks
•	🧠 Task grouping by status (To Do / In Progress / Done)
•	🪢 Drag-and-drop task management
•	📋 Create and manage multiple boards
•	👥 Share boards with other users via invitations
•	🔔 Accept/reject board invites via navbar notifications
•	🔒 Forgot password with local reset flow (popup UI)
•	🎨 Responsive, Bootstrap-styled UI
Tech Stack
•	Frontend: React, Bootstrap 5, Axios
•	Backend: Node.js, Express
•	Database: PostgreSQL (via Sequelize)
•	Authentication: JWT, bcryptjs
Folder Structure

.
├── client               # React frontend
│   ├── components       # Reusable UI components
│   ├── pages            # Main views (Login, Dashboard, etc.)
│   └── App.js           # App routing
├── server
│   ├── controllers      # Route handler logic
│   ├── models           # Sequelize models
│   ├── routes           # Express route definitions
│   ├── middleware       # Auth middleware
│   └── index.js         # Express app entry
├── .env                 # Environment variables
├── README.md
└── ...

Setup Instructions

1. Clone the repo

    git clone https://github.com/yourusername/taskmaster-pro.git
    cd taskmaster-pro

2. Setup Backend

    cd server
    npm install

Create a .env file in the server folder with:
    PORT=5000
    JWT_SECRET=your_jwt_secret
    DB_NAME=your_db
    DB_USER=your_user
    DB_PASS=your_password
    DB_HOST=localhost

Run migrations:
    npx sequelize-cli db:migrate

Start backend:
    npm start

3. Setup Frontend

    cd ../client
    npm install

Create .env in client:
    VITE_BACKEND_URL=http://localhost:5000

Start frontend:
    npm run dev

Forgot Password (Local Flow)

1. Click Forgot Password on login.
2. A popup appears with an email field.
3. If the email exists, enter a new password.
4. Password is updated and can be used to log in immediately.

API Endpoints

POST   /api/auth/register        Register new user
POST   /api/auth/login           Login & return JWT token
GET    /api/user/me              Get current user info
POST   /api/boards               Create a board
GET    /api/boards               Get all boards (owned + shared)
PATCH  /api/tasks/:id            Update a task
DELETE /api/tasks/:id            Delete a task
POST   /api/invite               Send board invitation
PATCH  /api/invite/respond       Accept/decline invitation
PATCH  /api/auth/reset-password  Reset user password

Deployment

Frontend: Vercel / Netlify
Backend: Render / Railway
Database: Render PostgreSQL
(Replace placeholder links once deployed.)

Author

Sameer Khan
📧 sameerkhan2zaz@gmail.com
🔗 https://linkedin.com/in/dummy

License
This project is licensed under the MIT License.
