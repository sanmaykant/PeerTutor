# Peer Tutoring Network

## Overview

The **Peer Tutoring Network** is a platform designed to enable students to assist each other by connecting those who need academic help with peers who have the skills and knowledge to assist them. The system intelligently matches students based on their strengths and weaknesses in various subjects, creating a supportive, collaborative learning environment. The project aims to bridge gaps in understanding, foster academic accountability, and cultivate a culture of peer-driven academic success.

## Features

- **User Authentication**: Secure login and registration process using JWT (JSON Web Tokens).
- **Profile Management**: Students create profiles that list their academic strengths and weaknesses.
- **Intelligent Matching**: The system matches students with peers who can help them based on their respective strengths and areas for improvement.
- **Real-Time Communication**: Built-in chat, video calling, and screen sharing capabilities using WebRTC for seamless interaction between peers.
- **Data Security**: Strong password protection with bcryptjs and secure data handling.
- **Cross-Platform**: Responsive design for both desktop and mobile users.
- **User Feedback**: Rating system for students to provide feedback on their tutoring sessions.

## Objectives

This platform aims to:

- Provide a peer-to-peer academic support system that enhances learning outside traditional classrooms.
- Encourage knowledge-sharing and collaboration among students.
- Increase academic engagement by helping students find the right academic assistance when they need it most.
- Foster a sense of community and academic accountability among students.

## Tech Stack

### Backend

- **Node.js**: Server-side JavaScript runtime environment.
- **Express.js**: Web framework for building the REST API.
- **MongoDB**: NoSQL database for storing user data and interactions.
- **Mongoose**: ODM for MongoDB to manage schema and data models.
- **Socket.io**: Real-time communication between the client and server for chat and signaling in WebRTC.
- **JWT (JSON Web Tokens)**: Used for secure authentication and session management.
- **bcryptjs**: Password hashing for secure login.
- **Joi**: Input validation to ensure data integrity.
- **CORS**: Middleware to handle cross-origin requests.

### Frontend

- **React**: JavaScript library for building the user interface.
- **Vite**: Build tool that optimizes the development process.
- **React Router**: For handling navigation between pages.
- **SCSS Modules**: Scoped styling for better maintainability and modular design.
- **lucide-react**: Icons library for a polished user interface.
- **WebRTC (RTCPeerConnection)**: For enabling real-time video and voice communication between peers.
- **Socket.io-client**: Client-side library for communication with the backend.

## Installation

### Prerequisites

- Node.js (>= 14.x.x)
- MongoDB (either local or cloud-based with MongoDB Atlas)
- npm or yarn for managing dependencies

### Steps to Run the Project

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/peer-tutoring-network.git
cd peer-tutoring-network
```

### 2. Install Dependencies

#### For the Backend:

```bash
cd server
npm install
```

#### For the Frontend:

```bash
cd ../client
npm install
```

---

### 3. Set Up Environment Variables

Create a `.env` file in the `/server` directory and add the following variables:

```ini
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_for_jwt
PORT=your_preferred_port
```

---

### 4. Start the Development Server

#### To Start the Backend:

```bash
cd server
npm run dev
```

#### To Start the Frontend:

```bash
cd ../client
npm run dev
```

> The frontend will typically run on [http://localhost:5173](http://localhost:5173)  
> The backend will typically run on [http://localhost:5000](http://localhost:5000)

---

### 5. Access the Application

Open your browser and navigate to:

[http://localhost:3000](http://localhost:3000)  
to access the **Peer Tutoring Network** platform.
