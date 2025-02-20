const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/chat", chatController.getOrCreateChat);
router.get("/chats/:userId", chatController.getUserChats);
router.post("/message", chatController.sendMessage);
router.get("/messages/:chatId", chatController.getChatMessages);

module.exports = router;

