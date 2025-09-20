// server.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./db");
const Message = require("./models/Message");
const path = require("path");

const app = express();

// ✅ Express CORS for REST API
app.use(cors({
  origin: "https://chat-2-2tsj.onrender.com", // deployed frontend URL
  credentials: true
}));

app.use(express.json());

// 👉 Route to fetch old chat messages
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [["createdAt", "ASC"]],
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve React build files
app.use(express.static(path.join(__dirname, "build")));

// Catch-all route for React (Express v5+)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Create HTTP server
const server = http.createServer(app);

// ✅ Socket.IO for real-time chat with CORS
const io = new Server(server, {
  cors: {
    origin: "https://chat-2-2tsj.onrender.com", // deployed frontend URL
    methods: ["GET", "POST"]
  }
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // Join a chat room
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  // Handle sending messages
  socket.on("sendMessage", async (data) => {
    try {
      const newMessage = await Message.create({
        sender: data.sender,
        content: data.content,
        room: data.room,
      });
      io.to(data.room).emit("receiveMessage", newMessage); // broadcast to room
    } catch (err) {
      console.error("Error saving message:", err.message);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Sync database and start server
sequelize.sync() // No force: true in production
  .then(() => {
    console.log("✅ Database synced");
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Database sync error:", err.message);
  });
