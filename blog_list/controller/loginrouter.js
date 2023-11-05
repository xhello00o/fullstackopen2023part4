const loginrouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {User, Session} = require('../models/index')
require('dotenv').config()



loginrouter.post('/', async (request, response, next) => {
    const username = request.body.username
    const password = request.body.password
    const user = await User.findOne({
        where:{username},
        include:{
            model:Session
        }
     })

    let newSession

    if (user.sessions.length > 0 ) {
        const delSessions = await Session.destroy({
            where: {
                userId: user.id
            }
        })
         newSession = await Session.create({
            userId: user.id
        })

    }
    else{
        newSession = await Session.create({
            userId: user.id
        })
    }
    
    
    console.log("🚀 ~ file: loginrouter.js:22 ~ loginrouter.post ~ session:", newSession.toJSON())

    console.log("🚀 ~ file: loginrouter.js:13 ~ loginrouter.post ~ user:", user.toJSON())
    
    const passwordCorrect = user.length ===0 ?
        false
        : await bcrypt.compare(password, user.passwordHash)


    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userToken = {
        username: user.username,
        id:user.id,
        sessionId: newSession.id
    }
    

    const token = jwt.sign(userToken, process.env.SECRET)

    response.status(200).send({ token, username: user.username, name: user.name })


})
module.exports = loginrouter