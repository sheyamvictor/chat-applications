const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Initialize App
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chat-app')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
  
// Message Schema
const MessageSchema = new mongoose.Schema({
  username: String,
  room: String, 
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', MessageSchema);

app.post('/messages', async (req, res) => {
  const { room } = req.body;
  const messages = await Message.find({ room }).sort({ timestamp: 1 });
  res.json(messages);
  
});

// WebSocket Connection
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", async (data) => {
    // Save the message to MongoDB
    const newMessage = new Message({
      username: data.author,
      room: data.room,
      message: data.message,
      timestamp: new Date(), 
    });
    await newMessage.save();

    // Emit the message to other users in the room
    socket.to(data.room).emit("receive_message", data)
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

// Start Server
server.listen(5000, () => console.log(`Server running on port 5000`));

