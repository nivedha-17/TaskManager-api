const express = require('express')
require('./db/mongoose')

const userRouter = require('./router/user')
const taskRouter = require('./router/task')

const app = express()

app.use(express.json())//automatically parse the json 
app.use(userRouter)
app.use(taskRouter)

module.exports = app