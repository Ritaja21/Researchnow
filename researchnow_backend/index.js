const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 8000;
const cookieParser = require('cookie-parser');
const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("sendMessage", async ({ chatId, senderId, content }) => {
        const chat = await Chat.findById(chatId);
        if (chat) {
            const message = { sender: senderId, content, timestamp: new Date() };
            chat.messages.push(message);
            await chat.save();
            io.emit("receiveMessage", message);
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
require('dotenv').config();
require('./db')


app.use("/api/auth", require("./Routes/authRoutes"));// user authentication
app.use("/api/dashboard", require("./Routes/dashboard")); //redirect to dashboard
app.use("/api/project", require("./Routes/projectRoutes"));// create, view, apply, applied student, review application
app.use("/api/professors", require("./Routes/professorRoutes"));//view professor dashboard for students
app.use("/api/students", require("./Routes/studentRoutes"));//view student dashboard for professor
app.use("/api/chat", require("./Routes/chatRoutes"));//get and send chat message

app.get('/', (req, res) => {
    res.json({ message: 'The API is working' });
});

