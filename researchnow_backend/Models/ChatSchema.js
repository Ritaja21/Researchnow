const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    professor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model("Chat", ChatSchema);
