const blogrouter = require('express').Router()
const Blog = require("../models/bloglist")
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const getTokenFrom = request => {
    const authorization = request.get('Authorization')
    console.log(authorization)
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }

blogrouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({}).populate('user',{blogs:0})
    response.json(blogs)
})

blogrouter.get('/:id', async (request, response, next) => {


    const result = await Blog.findById(request.params.id)

    if (result) {
        response.json(result)
    } else {
        response.status(404).end('404: Id cannot be found')
    }


})


blogrouter.post('/', async (request, response, next) => {
    const blogreq = request.body
    console.log(blogreq)
    const token = getTokenFrom(request)
    console.log(token,process.env.SECRET)
    const decodedToken = await jwt.verify(token,process.env.SECRET)
    console.log("decoded",decodedToken)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
      }
    
    const user = await User.findById(decodedToken.id)



    

    if (!blogreq.url || blogreq.url === "" || !blogreq.title || blogreq.title === "") {
        response.status(400).end()
    }
    if (!blogreq.likes || blogreq.likes === "") {
        blogreq.likes = 0
    }


    console.log("user", user)

    const blog = new Blog({
        ...blogreq,
        user: user._id
    })
    console.log("new blog",blog)

    const blogresult = await blog.save()
    console.log("blog", blogresult)
    user.blogs = user.blogs.concat(blogresult._id)

    const userresult = await user.save()
    console.log("user", userresult)

    response.status(201).json(blogresult)

})

blogrouter.delete('/:id', async (request, response, next) => {
    console.log("abc", request.params)
    const resp = await Blog.findByIdAndRemove(request.params.id)

    response.status(204).json(resp)
})

blogrouter.delete('/', async (request,response,next)=> {
    const allblogs = await Blog.find({})
    for (let oneblog of allblogs){
        const eachuser = await User.findById(oneblog.user)
        console.log("eachuser",eachuser)
        const filteredblogs = eachuser.blogs.filter(blog => false)
        console.log('filtered',filteredblogs)
        const user ={
            _id:eachuser._id,
            blogs:[]
        }
        console.log("user",user)
        const userresp = await User.findByIdAndUpdate(eachuser._id,user,{
            new:true,
            context:'query'
        })
        console.log("userresp",userresp)
    }
    

    const delresp= await Blog.deleteMany({})
    response.status(201).json({message:"successfuly deleted all" ,delresp})
})

blogrouter.put('/:id', async (request, response, next) => {
    const updatedblog = request.body
    const blog = {
        title: updatedblog.title,
        author: updatedblog.author,
        url: updatedblog.url,
        likes: updatedblog.likes
    }

    const result = await Blog.findByIdAndUpdate(request.params.id, blog, {
        new: true,
        context: 'query',
        runValidators: true,
    })
    if (result === null) {
        const error = new Error('Not Found')
        error.status = 500
        error.statusMessage = 'Not Found'

        next(error)
    }
    console.log("test", result)
    response.status(200).json(result)

})


module.exports = blogrouter

