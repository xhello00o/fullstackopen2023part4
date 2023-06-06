const userrouter = require('express').Router()
const User = require('../models/user')
const bcrypt  = require ('bcrypt')

userrouter.post('/', async (request,response) => {
    const {username,name,password} = request.body
    console.log(username,name,password)

    if (password.length<3) {
        response.status(400).send({error:'invalid password'})
    }
    else {
    const passwordHash = await bcrypt.hash(password,10)

    const newuser = new User ({
        username:username,
        name:name,
        passwordHash:passwordHash

    })

    const savedUser = await newuser.save()



    response.status(201).json(savedUser) }

})

userrouter.get("/", async (request,response)=> {
    const userresp = await User.find({}).populate('blogs',{user:0})
    response.status(200).json(userresp)
})

module.exports = userrouter