🧠 TaskMaster Pro
A full-stack collaborative task management application built using the MERN stack with PostgreSQL as the database. It allows users to manage boards, tasks, invite collaborators, and securely manage their accounts.
🚀 Features
•	🔐 User Authentication (Register, Login)
•	🧾 Forgot Password (local popup for resetting)
•	📋 Create, Edit, Delete Boards
•	👥 Invite Users to Shared Boards
•	✅ Create, Edit, Delete Tasks
•	📦 Drag & Drop Tasks Between Columns (Kanban style)
•	🔔 Notification System for Board Invitations
•	🎨 Responsive UI with Bootstrap styling
🛠️ Tech Stack
Frontend: React + Vite
Backend: Node.js + Express.js
Database: PostgreSQL
Auth: JWT, bcrypt
📁 Folder Structure

project-root/
│
├── client/               # React frontend
│   ├── components/
│   ├── pages/
│   └── ...
│
├── server/               # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── ...
│
├── .env
├── README.md
└── ...

🔧 Setup Instructions
🖥️ 1. Clone the Repository
git clone https://github.com/yourusername/taskmaster-pro.git
cd taskmaster-pro
⚙️ 2. Backend Setup
cd server
npm install
Create a `.env` file in `server/` with the following:

PORT=5000
DB_URL=postgresql://yourusername:yourpassword@localhost:5432/yourdb
JWT_SECRET=your_jwt_secret

Run migrations (if using Sequelize or manual SQL)
Start the backend:
npm run dev
🌐 3. Frontend Setup
cd client
npm install
npm run dev
🧪 API Endpoints
•	POST   /api/auth/register   - Register user
•	POST   /api/auth/login      - Login and get JWT token
•	POST   /api/auth/forgot     - (Local) Verify email
•	POST   /api/auth/reset      - (Local) Reset password
•	GET    /api/user            - Get logged-in user info
•	CRUD   /api/boards          - Manage boards
•	CRUD   /api/tasks           - Manage tasks
•	POST   /api/invitations     - Send board invites
🔐 Forgot Password (Local)
• A "Forgot Password?" link opens a Bootstrap-styled modal.
• User enters their registered email.
• If found, allows them to reset their password locally.
📸 Screenshots
*(Add your screenshots here once ready)*
🔗 Live Demo
Coming soon:
Frontend: https://yourfrontend.live
Backend API: https://yourapi.live
🤝 Contributors
• Sameer (Frontend + Backend)
• [Add your team members here]
📄 License
MIT License. © 2025 TaskMaster Team
