import express from "express";
import { Server } from "socket.io"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"
import routes from "./routes/index.js";

dotenv.config();
connectDB();

const app = express();
const io = new Server({
  cors: {
    origin: "http://localhost:5173"
  }
});
const HTTP_PORT = process.env.HTTP_PORT || 5000;
const SOCKET_PORT = Number(process.env.SOCKET_PORT) || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Express & TypeScript Backend is running!");
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join', (callId) => {
    socket.join(callId);
    console.log(`Socket ${socket.id} joined room ${callId}`);
  });

  socket.on('offer', (data) => {
    console.log(`Offer for room ${data.callId} from ${socket.id}`);
    socket.to(data.callId).emit('offer', data);
  });

  socket.on('answer', (data) => {
    console.log(`Answer for room ${data.callId} from ${socket.id}`);
    socket.to(data.callId).emit('answer', data);
  });

  socket.on('ice-candidate', (data) => {
    console.log(`ICE candidate for room ${data.callId} from ${socket.id}`);
    socket.to(data.callId).emit('ice-candidate', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


app.listen(HTTP_PORT, () => {
  console.log(`Server is running at http://localhost:${HTTP_PORT}`);
});

io.listen(SOCKET_PORT);
