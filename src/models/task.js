const mongoose = require('mongoose')
const validator = require('validator')
/* creates a model
const Task = mongoose.model('Task',{
    description: {
        type:String,
        required:true,
        trime:true,        
    },
    completed_status:{
        type:Boolean,
        default:false
    },
    Owner: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User' 
    }
})
*/
//creates a schema
const taskSchema = mongoose.Schema({
    description: {
        type:String,
        required:true,
        trime:true,        
    },
    completed_status:{
        type:Boolean,
        default:false
    },
    Owner: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User' 
    }
},{
    timestamps:true     
})

const Task = mongoose.model('Task',taskSchema)
module.exports = Task
