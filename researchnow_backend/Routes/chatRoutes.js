const express = require("express");
const { getChatMessages, sendMessage } = require("../Controller/chatcontroller");
const  authenticateUser  = require("../Middlewares/authMiddleware");

const router = express.Router();

router.get("/:studentId", authenticateUser, getChatMessages);  
router.post("/:chatId", authenticateUser, sendMessage);  

module.exports = router;
