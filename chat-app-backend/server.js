// server.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./db");
const Message = require("./models/Message");
const path = require("path");

const app = express();
app.use(cors());
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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React frontend
  },
});

// socket.io for real-time chat
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on("sendMessage", async (data) => {
    const newMessage = await Message.create({
      sender: data.sender,
      content: data.content,
      room: data.room,
    });
    io.to(data.room).emit("receiveMessage", newMessage); // send to room only
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

sequelize.sync() // No force: true in production!
  .then(() => {
    console.log("✅ Database synced");
    server.listen(5000, () => {
      console.log("🚀 Server running on http://localhost:5000");
    });
  });
