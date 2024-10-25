const express = require("express")
const connectDB = require("./config/db")
const app = express()
const dotenv = require("dotenv")
const cors = require("cors")
const authRoute = require("./routes/authRoute")
const http = require("http")
const {Server} = require("socket.io")
const Message = require("./models/messageModel")
const messagesRoute = require("./routes/messagesRoute")


const server = http.createServer(app)

connectDB()
dotenv.config()

const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", 
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    // Join a private room based on user IDs
    socket.on('join_room', ({ senderId, recipientId }) => {
      const roomId = getRoomId(senderId, recipientId);
      socket.join(roomId);
      console.log(`${senderId} joined room ${roomId}`);
    });
  
    // Handle message sending
    socket.on('send_message', async ({ senderId, recipientId, message }) => {
      const roomId = getRoomId(senderId, recipientId);
  
      // Save the message to the database
      const newMessage = new Message({
        sender: senderId,
        recipient: recipientId,
        message: message,
      });
  
      await newMessage.save();
  
      // Send message to the other user in the same room
      io.to(roomId).emit('receive_message', {
        senderId,
        recipientId,
        message,
      });
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  const getRoomId = (user1, user2) => {
    return [user1, user2].sort().join('_'); // Sort to make room ID unique regardless of order
  };

app.use(
    cors({
        origin: "http://localhost:5173",
        allowedHeaders : ["Content-Type", "Authorization", "auth-token"],
        methods : ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials : true
    })
)


app.use(express.json())
app.use("/uploads", express.static("uploads"))
app.use("/", authRoute)
app.use("/", messagesRoute)


const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});