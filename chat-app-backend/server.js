// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";

// Initialize Express app
const app = express();
const server = http.createServer(app);

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000", // Local frontend
  "https://chat-2-2tsj.onrender.com" // Deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Example HTTP route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);

  // Example: receive message from a client
  socket.on("message", (data) => {
    console.log("Message received:", data);
    // Broadcast message to all connected clients
    io.emit("message", data);
  });

  // Example: join room
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
    io.to(room).emit("message", `User ${socket.id} joined room ${room}`);
  });

  // Example: send message to a specific room
  socket.on("roomMessage", ({ room, message }) => {
    io.to(room).emit("message", message);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
