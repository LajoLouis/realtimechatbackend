const express = require("express")
const authController = require("../controllers/authController")
const {auth} = require("../middleware/auth")
const multer = require("multer")

const storage = multer.diskStorage({
    destination : function(req,file, cb){
        cb(null, "uploads/")
    },
    filename: function(req,file, cb){
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const upload = multer({storage:storage})
const router = express.Router()

router.post("/xhatya/register",upload.single("image"), authController.register)
router.post("/xhatya/login", authController.login)
router.get("/xhatya/getusers", authController.getAlluser)
router.get("/xhatya/userProfile", auth, authController.getUserProfile)
// router.patch("/xhatya/editUserProfile", auth, authController.editUserProfile)

module.exports = router