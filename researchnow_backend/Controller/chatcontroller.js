const Chat = require("../Models/ChatSchema");

exports.getChatMessages = async (req, res) => {
    try {
        const { studentId } = req.params;
        const userId = req.user.id;

        const chat = await Chat.findOne({
            $or: [
                { professor: userId, student: studentId },  // Professor fetching messages
                { professor: studentId, student: userId }   // Student fetching messages
            ]
        }).populate("messages.sender");
        if (!chat) {
            return res.status(404).json({ message: "Chat not found!" });
        }

        res.status(200).json({
            chatId: chat._id,
            messages: chat.messages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const senderId = req.user.id;
        const { content } = req.body;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found!" });
        }

        const message = { sender: senderId, content, timestamp: new Date() };
        chat.messages.push(message);
        await chat.save();

        res.status(200).json({ message: "Message sent!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};
