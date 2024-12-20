require('dotenv').config()
const express = require('express')
const cors = require('cors')
const routes = require('./Routes/routes')
require("./Connection/db")

const { chatApp, server } = require('./Socket/socket')
// const chatApp = express()

chatApp.use(cors())
chatApp.use(express.json())
chatApp.use(routes)

chatApp.use('/profilePics', express.static('./profilePics'))

const PORT = 3000 || process.env.PORT

server.listen(PORT, () => {
    console.log(`Server running at : ${PORT}`);
})