
# TaskPilot 🧠✅

TaskPilot Pro is a collaborative task management app built with the PERN stack (Postgres DB, Express.js, React, Node.js).

## 🚀 Features

- 📝 Create, update, and delete tasks  
- 📦 Organize tasks into boards and statuses  
- 👥 Invite team members to collaborate on boards  
- 🔐 Authentication with JWT & password hashing  
- 📬 Accept/Decline board invitations via in-app notifications  
- 🧩 Drag-and-drop task management  
- 🧠 Forgot Password with local password reset popup  
- 📊 View and manage owned and shared boards  
- 📌 Leave shared boards and manage board access control  


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
DB_HOST = Your Host
DB_POR T= Your Port
DB_USER = Your Username
DB_PASSWORD = Your Password
DB_NAME = Your Database Name
JWT_SECRET = Your Secrect Key
```

## 🛠️ Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/sameer-khan-a/Task_Pilot.git
    cd TaskPilot
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
    npm run dev
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

Here are some screenshots showcasing the features of the application:

### 🏠 Home Page
![Home Page](./public/images/Home.png)

### 🗂️ Task Board
![Task Board](./public/images/Task.png)

### 👤 Login Screen
![Login Screen](./public/images/Login.png)

### 🔔 Invitations Popup
![Invitations](./public/images/Invitations.png)

---

## 🌐 Website Links

- **Live Website**: [task-pilot-mu.vercel.app]

## 🤝 Contributing

Contributions welcome! Fork the repo and open a PR.

## 📄 License

Designed and Developed by Sameer Khan A © 2025 

