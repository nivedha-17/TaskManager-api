const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks',auth,async (req,res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body, //copies everything in the body to the object
        Owner: req.user._id
    })
    try {        
        await task.save()
        res.status(201).send(task)
    } catch(e) {
        res.status(400).send(e)
    } 
    /*const task = new Task(req.body)
    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })*/
})

//sends all tasks created by a user
/*router.get('/tasks',auth,async (req,res) => {
    try {
        //const task = await Task.find({Owner:req.user._id}) - 2 ways
        await req.user.populate('tasks').execPopulate()
        //res.send(task)
        res.send(req.user.tasks)
    } catch(e) {
        res.status(500).send(e)
    }
    /*Task.find({}).then((task) => {
        res.send(task)
    }).catch((e) => {
        res.status(500).send(e)
    })*/
//})

/*app.get('/tasks/:id',(req,res) => {
    const _id = req.params.id
    Task.findById(_id).then((task) => {
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }).catch((e) => {
        res.status(500).send()
    })
})*/

//sends all tasks based on a condition
//GET /tasks?completed_status=false
//pagination - by setting limit => /tasks?limit=10&skip=20
//sorting - /tasks?sortBy=createdAt:desc
router.get('/tasks',auth,async (req,res) => {
    const match = {}
    const sort = {}
    if(req.query.completed_status){
        match.completed_status = req.query.completed_status === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'? -1:1
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
                /*sort:{
                    //createdAt:1 //-1 for descending order, 1 for ascending order
                    completed_status:1//-1 for completed task, 1 for completed task
                }*/
            }
        }).execPopulate()
        
        res.send(req.user.tasks)
    } catch(e) {
        res.status(500).send(e)
    }
})  

router.get('/tasks/:id',auth,async (req,res) => {
    const _id = req.params.id
    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({_id,Owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch(e) {
        res.status(500).send(e)
    }
    /*Task.findOne({completed_status:_status}).then((task) => {
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    }).catch((e) => {
        res.status(500).send()
    })*/
})

router.patch('/tasks/:id',auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed_status']
    const isValidOp = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOp){
        return res.status(400).send('Invalid update') 
    }
    try {
        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id:req.params.id,Owner:req.user._id})
        //updates.forEach((update) => task[update] = req.body[update])
        //await task.save()
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new: true,runValidators: true})
        if(!task){
            return res.status(404).send()
        }  
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)  
    } catch(e) {
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id',auth, async (req,res) => {
    try {
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id:req.params.id,Owner:req.user.id})
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    } catch(e) {
        res.status(500).send(e)
    }
})

module.exports = router