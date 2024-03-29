const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp') 
const {sendWelcomEmail,sendCancelEmail} = require('../email/account')


router.post('/users',async (req,res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomEmail(user.email,user.name)
        const token = await user.generateToken()        
        res.status(201).send({user,token})
    } catch(e) {
        res.status(400).send(e) 
    }
    /*user.save().then(() => {
        res.status(201).send(user)
    }).catch((e) => {
        res.status(400).send(e)
    })*/
})

router.post('/users/login',async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateToken() 
        res.send({user,token})
        //res.send({user:user.getPublicProfile(),token})
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout',auth,async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.post('/users/logout-all',auth,async (req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})


router.patch('/users/me',auth,async (req,res) => { 
    const updates = Object.keys(req.body)   
    const allowedUpdates = ['name','email','password','age'] 
    const isValidOp = updates.every((update) => allowedUpdates.includes(update))    
    if(!isValidOp) {
        return res.status(400).send('Invalid update')
    }    
    try {
        //const user = await User.findById(req.user._id)
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true})
        /*if(!user){
            return res.status(404).send()
        }*/
        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }
}) 

//to run the middleware and then the router
router.get('/users/me',auth,async (req,res) => {
    res.send(req.user)
    /*User.find({}).then((user) => {
        res.send(user)
    }).catch((e) => {
        res.status(500).send()
    })*/
})  

/*router.get('/users/:id',async (req,res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    } catch(e) {
        res.status(500).send()
    } 
    /*const _id = req.params.id
    User.findById(_id).then((user) => {
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    }).catch((e) => {
        res.status(500).send()
    })*/
//})

router.delete('/users/del',auth,async (req,res) => {
    try {
        /*const user = await User.findByIdAndDelete(req.user._id)
        if(!user){
            res.status(404).send()
        }*/
        await req.user.remove()
        sendCancelEmail(req.user.email,req.user.name)
        res.send(req.user)        
    } catch(e) {
        res.status(500).send(e)
    }
})
const upload = multer({
    //dest:'avatar', now multer will not save in directory, instead saves on user profile 
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,cb){        
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            cb(new Error('Please upload jpg or jpeg or png files'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res) => {
    //req.user.avatar = req.file.buffer//contains all binary info of file
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next) => {
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth,async (req,res) =>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar',async (req,res) => {
    try {
       const user = await User.findById(req.params.id)
       if(!user || !user.avatar) {
            throw new Error()
       }
        res.set('content-type','image/png')
        res.send(user.avatar)
    } catch(e) {
        res.status(404).send()
    }
})

module.exports = router