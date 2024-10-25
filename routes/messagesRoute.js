const express = require("express")
const { auth } = require("../middleware/auth")
const messagesController = require("../controllers/messagesController")

const router = express.Router()

router.post("/xhatya/getmessages", auth, messagesController.getChatHistory )

module.exports = router