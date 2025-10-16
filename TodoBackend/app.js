import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

// Load environment variables first
dotenv.config({
  path: "./.env",
});

const app = express();
const server = http.createServer(app);

// Enhanced CORS configuration - Apply CORS to all routes
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Socket.io configuration
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Send welcome message
  socket.emit("welcome", {
    message: "Connected to server successfully",
    socketId: socket.id,
  });

  // Handle client joining rooms
  socket.on("join", (room) => {
    socket.join(room);
    console.log(`Client ${socket.id} joined room: ${room}`);
  });

  socket.on("disconnect", (reason) => {
    console.log("Client disconnected:", socket.id, "Reason:", reason);
  });

  socket.on("error", (error) => {
    console.error("Socket error for client", socket.id, ":", error);
  });
});

// Make io accessible to our routes
app.set("io", io);

// Import Routes
import taskRoutes from "./routes/task.route.js";

// Use Routes
app.use("/api/tasks", taskRoutes);

// // Health check endpoint
// app.get("/api/health", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Server is running!",
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || "development",
//     connectedClients: io.engine.clientsCount
//   });
// });

// Socket.io status endpoint
// app.get("/api/socket-status", (req, res) => {
//   const sockets = Array.from(io.sockets.sockets.values());
//   res.json({
//     success: true,
//     connectedClients: io.engine.clientsCount,
//     sockets: sockets.map(socket => ({
//       id: socket.id,
//       connected: socket.connected,
//       rooms: Array.from(socket.rooms)
//     }))
//   });
// });

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to MERN Stack Todo API Server",
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: error.message,
  });
});

// MongoDB connection and server start
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`
Server is running!
Port: ${PORT}
Frontend URL: ${process.env.FRONTEND_URL}
Socket.IO: Enabled
Database: Connected
      `);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });

export default app;
