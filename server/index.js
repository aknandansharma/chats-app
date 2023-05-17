const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

// server configure
const server = http.createServer(app);

// socket.io configure for client
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// this is all backend functionality
io.on("connection", (socket) => {
  console.log(`Connected: ${socket.id}`);

  // join room
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // send message to room
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  // leave room
  socket.on("disconnect", () => {
    console.log("Disconnected", socket.id);
  });
});

// server listen on port 8080
server.listen(8080, () => {
  console.log("SERVER RUNNING ON PORT 8080");
});