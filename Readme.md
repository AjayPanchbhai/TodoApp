# Interactive Task Manager - MERN Stack

A full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js) featuring real-time collaboration using Socket.io, email notifications, and a responsive user interface.

## Features

- **Full CRUD Operations** - Create, read, update, and delete tasks
- **Real-time Updates** - Instant synchronization across all clients using Socket.io
- **Email Notifications** - Automatic emails when tasks are marked as completed
- **Status Tracking** - Track tasks as To Do, In Progress, or Completed
- **Smart Filtering** - Filter tasks by status
- **Responsive Design** - Works seamlessly on all devices
- **Fast Performance** - Built with Vite for optimal development experience

## Tech Stack

**Frontend:**

- React
- Vite
- Socket.io-client
- Axios
- CSS3

**Backend:**

- Node.js with Express
- MongoDB with Mongoose
- Socket.io
- Nodemailer
- CORS

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

## Setup Instructions

### 1. Clone the Repository

````bash
git clone https://github.com/AjayPanchbhai/TodoApp.git


----------------------------------------------------------------------------------


# Set up environment variables
cp .env.example .env

## Edit the .env file with your configuration:
PORT=5000
MONGODB_URI=YOUR_MONGODB_URI/DATABASE_NAME
FRONTEND_URL=http://localhost:3000
EMAIL_USER=YOUR_EMAIL_USER
EMAIL_PASS=YOUR_EMAIL_PASS

----------------------------------------------------------------------------------

 **Email Setup Options**

You can configure automatic email notifications using **Gmail App Passwords** or **Ethereal Email**.


###  Option 1: Gmail (Recommended for Production)

Gmail no longer supports direct password login for third-party apps.
You need to generate a **16-character App Password** and use it in your `.env` file.

#### Steps:

1. Go to your **Google Account Security Settings** → [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**.
3. Once enabled, go to **App Passwords** → [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Select:
   - **App:** "Mail"
   - **Device:** "Other (Custom name)" → type something like "TaskManagerApp"
5. Copy the generated **16-character App Password**.
6. Use it in your `.env` file as follows:

```env
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_generated_app_password

----------------------------------------------------------------------------------

### Option 2: Ethereal Email (For Testing Only)

Ethereal Email
 is a free fake SMTP service for testing email functionality — it doesn’t send real emails but allows you to view them online.
🧩 Steps:

1. Go to https://ethereal.email/create
2. Click “Create Ethereal Account”.
3. Copy your generated credentials (host, port, user, pass).

Update your .env file:
```env
EMAIL_USER=your_ethereal_user
EMAIL_PASS=your_ethereal_pass

----------------------------------------------------------------------------------

# Start the backend and frontend server
# Terminal 1 - Backend
cd TodoBackend
# Install dependencies
npm install

# start server
npm run dev

# Terminal 2 - Frontend
cd TodoFrontend
# Install dependencies
npm install

# start server
npm run dev

----------------------------------------------------------------------------------
````
