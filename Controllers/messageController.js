const Users = require("../Models/userModel");
const Message = require("../Models/messageModel")
const Conversation = require("../Models/conversationModel");

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
                messages: [], // initialize with an empty array
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text
        });

        await newMessage.save();

        // Add the new message to the conversation's messages array
        conversation.messages.push(newMessage._id);

        // Save the updated conversation
        await conversation.save();

        // Return the new message as a response
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
