const Users = require("../Models/userModel");
const Message = require("../Models/messageModel")

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
        const newMessage = new Message({
            text, receiverId, senderId
        })
        await newMessage.save()
        res.status(200).json(newMessage)

    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
}


exports.getMessages = async (req, res) => {
    try {
        const { id: anotherUserId } = req.params
        const myId = req.payload

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: anotherUserId },
                { senderId: anotherUserId, receiverId: myId }
            ],
        })
        res.status(200).json(messages)
    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
}
