
require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require('cors');
const connectDB = require("./config/dbConfig")
// Enable CORS for all routes
app.use(cors());

connectDB();

// Create Socket.IO instance with CORS configuration
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Replace with your React app URL
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    // Handle custom events
    socket.on('message', (data) => {
        console.log('Received message:', data);

        // Broadcast to all clients except sender
        socket.broadcast.emit('message', data);

        // Or emit to all clients including sender
        // io.emit('message', data);
    });

    // Join a room
    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    // Send message to specific room
    socket.on('room_message', (data) => {
        io.to(data.room).emit('message', data.message);
    });
});
app.use(express.json());  
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send({
        code: 200,
        message: 'Api is running'
    })
})

require("./config/routeConfig")(app)


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});