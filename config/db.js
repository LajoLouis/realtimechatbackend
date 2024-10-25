const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connected to MongoDB...");
        
    } catch (error) {
        console.log("Could not establish connection", error);
        
    }
}


module.exports = connectDB