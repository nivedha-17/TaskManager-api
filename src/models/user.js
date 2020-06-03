const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error('email is invalid') 
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0) {
                throw new Error('age must be a positive number')
            } 
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot contain password')
            }     
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        } 
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

//virtual relationship between two collection - not stored in database
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id', //id relates user and task
    foreignField:'Owner' //owner in task is related with user
})


//userSchema.methods.getPublicProfile = function() {
userSchema.methods.toJSON = function() {    
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens 
    delete userObject.avatar
    return userObject
}

userSchema.methods.generateToken = async function() {
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email,pswd) => {
    const user = await User.findOne({email})
    if(!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(pswd,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}

//to hash the plaintext password before the user is saved
userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')) {
         user.password = await bcrypt.hash(user.password,8)
    }
    next() 
})

//Delete tasks when user is deleted
userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({Owner:user._id}) 
    next()
})


const User = mongoose.model('User',userSchema)

module.exports = User