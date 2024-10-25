const Message = require("../models/messageModel")

exports.getChatHistory = async(req,res)=>{
    const{ senderId, recipientId } = req.body
    try {
        const messages = await Message.find({
          $or: [
            { sender: senderId, recipient: recipientId },
            { sender: recipientId, recipient: senderId },
          ],
        }).sort({ timestamp: 1 }); // Sort by timestamp to get messages in order
        res.json(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
}