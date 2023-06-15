const testrouter = require('express').Router()
const Blog = require("../models/bloglist")
const User = require('../models/user')


testrouter.post("/reset", async (request,response,next)=>{
    const blogres = await Blog.deleteMany({})
    console.log("🚀 ~ file: testrouter.js:10 ~ testrouter.post ~ blogres:", blogres)
    const userres = await User.deleteMany({})
    console.log("🚀 ~ file: testrouter.js:11 ~ testrouter.post ~ userres:", userres)
    
    
    response.status(204).end()
})

module.exports =testrouter