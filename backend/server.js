import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io"
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js"
import routes from "./routes/index.js";
import ChatMessage from "./models/chat.js"
import User from "./models/user.js"

connectDB();

const app = express();
const HTTP_PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With", "auth_token"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Express & TypeScript Backend is running!");
});

const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join", (data) => {
    socket.join(data.roomId);
    socket.to(data.roomId).emit("join", data);
    console.log(`Socket ${socket.id} joined room ${data.roomId}`);
  });

  socket.on("offer", (data) => {
    console.log(`Offer for room ${data.roomId} from ${socket.id}`);
    socket.to(data.roomId).emit("offer", data);
  });

  socket.on("answer", (data) => {
    console.log(`Answer for room ${data.roomId} from ${socket.id}`);
    socket.to(data.roomId).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    console.log(`ICE candidate for room ${data.roomId} from ${socket.id}`);
    socket.to(data.roomId).emit("ice-candidate", data);
  });

  socket.on("peer-connect", (data) => {
    console.log(`User connected: ${socket.id}`);
    socket.to(data.roomId).emit("peer-connect", data);
  });

  socket.on("peer-disconnect", (data) => {
    console.log(`User disconnected: ${socket.id}`);
    socket.to(data.roomId).emit("peer-disconnect", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  socket.on("event", (data) => {
      socket.to(data.roomId).emit("event", data);
  });

  socket.on("join-chat", (user1, user2) => {
      socket.join([ user1, user2 ].sort().toString());
      console.log(user1, user2);
  })

  socket.on("chat-message", async ({ sender, reciever, ...message }) => {
      const senderUser = await User.findOne({ username: sender });
      const recieverUser = await User.findOne({ username: reciever });
      const chatMessage = new ChatMessage({
          sender: senderUser._id,
          recipient: recieverUser._id,
          message: message.text,
      });
      await chatMessage.save();
      socket.to([ sender, reciever ].sort().toString()).emit("chat-message", message);
  });
});


server.listen(HTTP_PORT, () => {
  console.log(`Server is running at http://localhost:${HTTP_PORT}`);
});
