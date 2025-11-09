Smart Feedback Collection and Analysis System:

A full-stack web application that collects customer feedback, performs real-time sentiment analysis, and visualizes insights using interactive charts. Built with React (frontend), Node.js + Express (backend), and MongoDB (database) with JWT authentication and role-based access.

🚀 Features
✅ User Features

Register/Login using secure JWT authentication

Submit feedback for any product

View personal feedback history (user-specific)

Optional Guest Mode for anonymous feedback submission

✅ Admin Features

View all user feedbacks

Delete inappropriate feedback

Access real-time Sentiment Summary (Pie Chart)

View Daily Sentiment Trends (Bar Chart)

✅ System Features

Real-time sentiment analysis using the Sentiment npm library

Feedback stored in MongoDB with timestamps

Secure authentication using bcrypt + JWT

Responsive UI with Bootstrap

Charts built using Chart.js + react-chartjs-2

🏗 Project Architecture
Frontend (React + Bootstrap + Axios)

User Interface

Authentication forms

Feedback submission

Dashboard with Pie & Bar charts

Role-based UI for User/Admin

Backend (Node.js + Express)

REST API for authentication, feedback, and analytics

JWT-based session management

Sentiment analysis engine

Input validation & error handling

Database (MongoDB + Mongoose)

Users Collection

Feedback Collection

Indexed for fast trend & history queries

📂 Project Structure
SmartFeedbackProject/
│
├── backend/
│   ├── models/User.js
│   ├── models/Feedback.js
│   ├── server.js
│   ├── package.json
│
└── frontend/
    ├── src/
    │   ├── App.js
    │   ├── index.js
    │   └── components/...
    ├── public/
    ├── package.json

🛠 Tech Stack
Frontend

React.js

Bootstrap

Axios

Chart.js + react-chartjs-2

Backend

Node.js

Express.js

Sentiment (NPM Library)

bcryptjs

jsonwebtoken (JWT)

Database

MongoDB

Mongoose ODM

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/Smart-Feedback-System.git
cd Smart-Feedback-System

Backend Setup
cd backend
npm install
node server.js


Server runs at:

http://localhost:5000

Frontend Setup
cd frontend
npm install
npm start


Frontend runs at:

http://localhost:3000

📊 API Endpoints
Authentication
Method	Route	Description
POST	/api/register	Register new user
POST	/api/login	Login & get token
Feedback
Method	Route	Description
POST	/api/feedback	Submit feedback
GET	/api/feedbacks?user_id=xyz	Get user-specific feedback
GET	/api/feedbacks	Admin: get all feedback
Analytics
Method	Route	Description
GET	/api/summary	Sentiment summary
GET	/api/trends	Daily sentiment trends
📈 Analytics Dashboard

✅ Pie Chart – Overall Sentiment Distribution

✅ Bar Chart – Daily Sentiment Trends

✅ Auto-refreshing via Axios

🔐 Security

Passwords hashed with bcryptjs

JWT tokens for login sessions

Input validation for feedback & auth

Role-based access (User / Admin)

✅ Future Enhancements

Multi-language sentiment analysis

Dark/Light theme toggle

Push notifications

Mobile app (React Native)

Advanced analytics dashboard

👩‍💻 Author

Pasupuleti Gayathri
