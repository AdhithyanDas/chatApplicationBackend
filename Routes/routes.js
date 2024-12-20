const express = require('express')

const userController = require('../Controllers/userController')
const messageController = require('../Controllers/messageController')

const jwtMiddle = require('../Middleware/jwtMiddleware')
const multerConfigForProfile = require('../Middleware/multerConfigForProfile')

const router = express.Router()

router.post('/reg', userController.userRegistration)
router.post('/log', userController.userLogin)
router.put('/updateprofile', jwtMiddle, multerConfigForProfile.single('profilePic'), userController.profileUpdate)
router.delete('/delaccount/:email', jwtMiddle, userController.deleteAccount)

router.get('/home', jwtMiddle, messageController.getUsersForSidebar)
router.post('/sendmessage/:id', jwtMiddle, messageController.sendMessages)
router.get('/getmessage/:id', jwtMiddle, messageController.getMessages)

module.exports = router