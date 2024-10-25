const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const auth = async (req,res,next) =>{
    const token = req.header("auth-token")
    if (!token) {
        res.json("Unauthorized access")
    }else{
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            const user = await User.findById(decoded.id).select("-password")
            req.user = user
            next()
        }catch(error){
            console.log(error);
        }
    }

    
}
const admin = async(req,res,next)=>{
    if (req.user.role !== "admin") {
        res.json("Access Denied")
    }else{
        next()
    }

    
}

module.exports = {auth, admin}