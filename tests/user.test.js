const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {user1ID,user1,setupDatabase} = require('./fixtures/db')

//the test will run after beforeEach is completed
beforeEach(setupDatabase)

test('should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name:'nivedha',
        email:'nivedhasurendran@gmail.com',
        password:'123456789'
    }).expect(201) 

    //assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //assertions about the response
    //expect(response.body.user.name).toBe('Nandhana')
    expect(response.body).toMatchObject({
        user: {
            name: 'nivedha',
            email: 'nivedhasurendran@gmail.com',            
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('123456789')
})

test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email:user1.email,
        password:user1.password
    }) .expect(200)
    //to check whether the user has logged in successfully
    const user = await User.findById(user1ID)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email:user1.email,
        password:'123456252'
    }).expect(400)
})

test('should fetch profile of an user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should not get profile for unauthenticated users', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('should delete the account for user', async  () => {
    await request(app)
        .delete('/users/del')
        .set('Authorization',`Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
    //to check whether the user is removed
    const user = await User.findById(user1ID)
    expect(user).toBeNull()    
})

test('should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/del')
        .send()
        .expect(401)
})

test('should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization',`Bearer ${user1.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg') //to attach a file
        .expect(200)

    const user = await User.findById(user1ID)   
    expect(user.avatar).toEqual(expect.any(Buffer)) //it checks for type
})

test('should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${user1.tokens[0].token}`)
        .send({
            name: 'jayanthi'
        })
        .expect(200)
    
    const user = await User.findById(user1ID)
    expect(user.name).toBe('jayanthi')    
})

test('should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${user1.tokens[0].token}`)
        .send({
            location: 'trichy'
        })
        .expect(400)           
})

