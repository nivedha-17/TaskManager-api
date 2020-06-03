const mongoose = require('mongoose')
const validator = require('validator')
mongoose.connect(process.env.MONGODB_URL, { 
    useNewUrlParser:true,
    useCreateIndex:true,   //to quickly access data
    useUnifiedTopology:true,
    useFindAndModify:false
})
/*const me = new User({
    name:'  Nivedha  S',
    email:'nivemarch94@gmail.com ',
    age: 26,
    password: '2514ophj'    
})
me.save().then(() => {
    console.log(me)
}).catch((error) => {
    console.log('Error',error)
})*/

//challenge
/*const Task = mongoose.model('Tasks',{
    description: {
        type: String,
        required:true,
        trim:true
    },
    completed_status: {
        type: Boolean,
        default:false
    }
})
/*const task1 = new Task({
   description: 'Game theory'
    
})
task1.save().then(() => {
    console.log(task1)
}).catch((error) => {
    console.log('Error-',error)
})*/