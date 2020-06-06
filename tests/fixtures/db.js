const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const user1ID = new mongoose.Types.ObjectId()
const user1 = {
    _id: user1ID,
    name:'Nandhana',
    email:'nandhusmarch16@gmail.com',
    password:'123456789',
    tokens:[{
        token:jwt.sign({_id:user1ID},process.env.JWT_SECRET)
    }]
}

const user2ID = new mongoose.Types.ObjectId()
const user2 = {
    _id: user2ID,
    name:'Jayanthi',
    email:'nivemarch94@gmail.com',
    password:'123456789',
    tokens:[{
        token:jwt.sign({_id:user2ID},process.env.JWT_SECRET)
    }]
}

const task1 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',  
    completed_status: false,
    Owner: user1ID  
}

const task2 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',  
    completed_status:true,
    Owner: user2ID  
}

const task3 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',  
    completed_status:true,
    Owner: user1ID  
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(user1).save()
    await new User(user2).save()
    await new Task(task1).save()
    await new Task(task2).save()
    await new Task(task3).save()
}

module.exports = {
    user1ID,
    user2ID,
    user1,
    user2,
    task1,
    task2,
    task3,
    setupDatabase
}