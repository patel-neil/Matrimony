const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

// Get or create a chat between two users
exports.getOrCreateChat = async (req, res) => {
  const { userId, otherUserId } = req.body;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, otherUserId] },
    }).populate("lastMessage");

    if (!chat) {
      chat = new Chat({
        participants: [userId, otherUserId],
      });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Error fetching chat" });
  }
};

// Fetch all chats for a user
exports.getUserChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "username email")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Error fetching chats" });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  const { chatId, senderId, content } = req.body;

  try {
    const message = new Message({
      chatId,
      sender: senderId,
      content,
    });

    await message.save();

    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: "Error sending message" });
  }
};

// Fetch messages for a chat
exports.getChatMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
};
