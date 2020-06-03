const express = require('express')
require('./db/mongoose')

const userRouter = require('./router/user')
const taskRouter = require('./router/task')

const app = express()
const port = process.env.PORT

//middleware
/*app.use((req,res,next) => {
    if(req.method==='GET') {
        res.send('GET requests are disabled')
    } else {
        next()
    }
})*/

//challenge-middleware
/*app.use((req,res,next) => {
    res.status(503).send('Under maintenance')    
})*/

//to upload files
/*const multer = require('multer')
const upload = multer({
    dest:'images',//destn folder
    limits: {
        fileSize: 1000000 //1MB
    },
    fileFilter(req,file,cb) { //to filter fles which shd not get uploaded
        //cb(new Error('file is of different type'))
        //cb(undefined,true)//to accept the file
        //if(!file.originalname.endsWith('.pdf')){
        if(!file.originalname.match(/\.(doc|docx)$/)){    
            return cb(new Error('Please upload a DOC or DOCX '))
        }     
        cb(undefined,true)
    }
})     

app.post('/upload',upload.single('upload'),(req,res) => {
    res.send()
},(error,req,res,next) => {  //to handle errors
    res.status(400).send({error:error.message})
})*/



app.use(express.json())//automatically parse the json 
app.use(userRouter)
app.use(taskRouter)


app.listen(port,() => {
    console.log('Server is up on port '+port)
})


/*const jwt = require('jsonwebtoken')

const myFunc = async () => {
    const token = jwt.sign({_id:'abc123'},'thisisNodejsCourse',{expiresIn:'2 weeks'})
    console.log(token)
    const isVerify = jwt.verify(token,'thisisNodejsCourse')
    console.log(isVerify)
}
myFunc()*/

/*const pet = {
    name: 'nandhana'
}

pet.toJSON = function() {
   // console.log(this)
    return {}
}
console.log(JSON.stringify(pet))*/

/*const Task = require('./models/task')
const User = require('./models/user')
const main = async () => {
    //from task to user
    /*const task = await Task.findById('5ed33e94eb3bec2618c7c14b')
    await task.populate('Owner').execPopulate() //allows to polpulate data from a relationship
    console.log(task.Owner)*/
    //from user to task
    /*const user = await User.findById('5ed33d558b021b2144962395')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}
main()*/