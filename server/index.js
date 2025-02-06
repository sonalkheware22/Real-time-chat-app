const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // When a user joins
  socket.on("join", (userId) => {
    users[socket.id] = userId;
    console.log(`User ${userId} joined: Socket ${socket.id}`);
  });

  // Handle sending messages
  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message);
  });

  // Handle typing event
  socket.on("typing", (username) => {
    socket.broadcast.emit("userTyping", username);
  });

  // Handle stop typing event
  socket.on("stopTyping", () => {
    socket.broadcast.emit("stopTyping");
  });

  // Handle read receipt
  socket.on("readReceipt", ({ messageId, userId }) => {
    console.log(`Message ${messageId} was read by user ${userId}`);
    // You can broadcast this to other users, or use it to update the message status
    socket.broadcast.emit("messageRead", { messageId, userId });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    delete users[socket.id];
  });
});

server.listen(5000, () => {
  console.log("WebSocket server running on port 5000");
});
