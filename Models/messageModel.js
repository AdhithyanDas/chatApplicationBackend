const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    text: {
        type: String
    },
},
    { timestamps: true }
)

const Message = mongoose.model("Message", messageSchema)

module.exports = Message