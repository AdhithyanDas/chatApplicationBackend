const Users = require("../Models/userModel");
const Message = require("../Models/messageModel")
const Conversation = require("../Models/conversationModel");
const { getReceiverSocketId, io } = require("../Socket/socket");

exports.getUsersForSidebar = async (req, res) => {
    try {
        const loggedUserId = req.payload
        const filteredUsers = await Users.find({ _id: { $ne: loggedUserId } }).select("-password")
        res.status(200).json(filteredUsers)
    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
}


exports.sendMessages = async (req, res) => {
    try {
        const { text } = req.body
        const { id: receiverId } = req.params
        const senderId = req.payload

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },

        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                messages: [],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text
        });

        await newMessage.save();

        conversation.messages.push(newMessage._id);
        await conversation.save();

        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", {
                _id: newMessage._id,
                senderId,
                receiverId,
                text,
                createdAt: newMessage.createdAt,
            })
        }

        res.status(201).json(newMessage);

    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
}


exports.getMessages = async (req, res) => {
    try {
        const { id: anotherUserId } = req.params
        const myId = req.payload

        const conversation = await Conversation.findOne({
            participants: { $all: [myId, anotherUserId] },
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json([]);
        }

        res.status(200).json(conversation.messages);

    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
}
