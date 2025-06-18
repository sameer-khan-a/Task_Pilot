
# TaskMaster Pro 🧠✅

TaskMaster Pro is a collaborative task management app built with the MERN stack (MongoDB, Express.js, React, Node.js) and PostgreSQL for robust data management.

## 🚀 Features

- 📝 Create, update, and delete tasks
- 📦 Organize tasks into boards and statuses
- 👥 Invite team members to collaborate on boards
- 🔐 Authentication with JWT & password hashing
- 📬 Accept/Decline board invitations via in-app notifications
- 🧩 Drag-and-drop task management
- 🧠 Forgot Password with local password reset popup

## 🖼️ Tech Stack

**Frontend:** React, Bootstrap 5  
**Backend:** Node.js, Express.js  
**Database:** PostgreSQL  
**Authentication:** JWT, bcrypt.js

## 📂 Project Structure

```
/client         # React frontend
/server         # Express backend
/server/models  # Sequelize models
```

## ⚙️ Environment Variables

Create a `.env` file in `/server`:

```
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_pass
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
```

## 🛠️ Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/taskmaster-pro.git
    cd taskmaster-pro
    ```

2. Install dependencies:
    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

3. Setup your PostgreSQL database and run migrations.

4. Start the app:
    ```bash
    cd server
    npm start
    # In another terminal
    cd client
    npm run dev
    ```

## 📦 API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/user/me`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/boards/invite`
- `POST /api/boards/accept`
- `POST /api/auth/forgot-password`

## 📷 Screenshots

_Dummy screenshots here_

## 🤝 Contributing

Contributions welcome! Fork the repo and open a PR.

## 📄 License

MIT © 2025 Sameer A

