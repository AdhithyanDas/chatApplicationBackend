const { Server } = require("socket.io");
const http = require('http')
const express = require('express')

const chatApp = express()

const server = http.createServer(chatApp)
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
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
    if (userId != "undefined") {
        userSocketMap[userId] = socket.id
        console.log("User Socket Map:", userSocketMap);
    }

    if (userId && userId !== "undefined") {
        // Store user socket mapping
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    console.log("Emitting online users:", Object.keys(userSocketMap)); // Debugging


    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        // delete userSocketMap[userId]
        // io.emit("getOnlineUsers", Object.keys(userSocketMap))
        if (userId) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit the updated online users
            console.log("Emitting updated online users:", Object.keys(userSocketMap)); // Debugging
        }
    })
})

module.exports = {
    chatApp, server, io, getReceiverSocketId
}