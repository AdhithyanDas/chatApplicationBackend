const { Server } = require("socket.io");
const http = require('http')
const express = require('express')

const chatApp = express()

const server = http.createServer(chatApp)
const io = new Server(server, {
    cors: {
        origin: ["https://chat-application-plum-rho.vercel.app"],
        methods: ["POST", "GET", "PUT", "DELETE"]
    }
})

const userSocketMap = {}

const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId]
}

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId

    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log("User Socket Map:", userSocketMap);
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        if (userId) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
            console.log("Emitting updated online users:", Object.keys(userSocketMap));
        }
    });
})

module.exports = {
    chatApp, server, io, getReceiverSocketId
}