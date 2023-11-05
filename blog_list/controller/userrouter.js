const userrouter = require('express').Router()
const {User, Blog} = require('../models/index')
const bcrypt  = require ('bcrypt')


userrouter.post('/', async (request,response) => {
    const {username,name,password} = request.body
    console.log(username,name,password)

    if (password.length<3) {
        response.status(400).send({error:'invalid password'})
    }
    else {  
    const passwordHash = await bcrypt.hash(password,10)

    const newuser =  User.build ({
        username:username,
        name:name,
        passwordHash:passwordHash
    })

    const savedUser = await newuser.save()



    response.status(201).json(savedUser) }

})

userrouter.get("/", async (request,response)=> {
    const userresp = await User.findAll()
    response.status(200).json(userresp)
})

userrouter.get('/:id', async(req,res,next)=>{
    const readFlag = req.query.read
    const user_id = req.params.id
    let where = {}

    if (readFlag) {
        where.marked_read = readFlag
    }
    
    const userData = await User.findOne({
        where:{
            id:user_id
        },
    include:[{
        model: Blog,
        as: 'fav_blogs',
        through:{
            attributes:['marked_read','id'],
            where
        }         
        
    }] })
    res.status(200).json(userData)


})

userrouter.put('/:username',async(request,response) => {
    const username = request.params.username
    const userAcc = User.findOne({
        where:{
            username
    }})
})

module.exports = userrouter