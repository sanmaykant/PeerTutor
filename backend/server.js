import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import ChatMessage from "./models/chat.js";
import User from "./models/user.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Attach socket.io to Express server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://peer-tutor-d91l.vercel.app"], // replace with your actual frontend domain
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Backend is running.");
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join", (data) => {
    socket.join(data.roomId);
    socket.to(data.roomId).emit("join", data);
  });

  socket.on("offer", (data) => {
    socket.to(data.roomId).emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.to(data.roomId).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.roomId).emit("ice-candidate", data);
  });

  socket.on("peer-connect", (data) => {
    socket.to(data.roomId).emit("peer-connect", data);
  });

  socket.on("peer-disconnect", (data) => {
    socket.to(data.roomId).emit("peer-disconnect", data);
  });

  socket.on("join-chat", (user1, user2) => {
    socket.join([user1, user2].sort().toString());
  });

  socket.on("chat-message", async ({ sender, reciever, ...message }) => {
    const senderUser = await User.findOne({ username: sender });
    const recieverUser = await User.findOne({ username: reciever });
    const chatMessage = new ChatMessage({
      sender: senderUser._id,
      recipient: recieverUser._id,
      message: message.text,
    });
    await chatMessage.save();
    socket.to([sender, reciever].sort().toString()).emit("chat-message", message);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start server (Express + Socket.io)
server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
