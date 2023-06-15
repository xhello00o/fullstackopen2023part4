const blogrouter = require('express').Router()
const Blog = require("../models/bloglist")
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../util/middleware')
require('dotenv').config()



blogrouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({}).populate('user', { blogs: 0 })
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


blogrouter.post('/', middleware.userExtractor, async (request, response, next) => {
    const blogreq = request.body
    console.log(blogreq)

    const user = await User.findById(request.user)

    if (!blogreq.url || blogreq.url === "" || !blogreq.title || blogreq.title === "") {
        return response.status(400).send({error:"Missing Url or Title"})
    }
    if (!blogreq.likes || blogreq.likes === "") {
        blogreq.likes = 0
    }
    console.log("user", user)

    const blog = new Blog({
        ...blogreq,
        user: user._id
    })
    console.log("new blog", blog)

    const blogresult = await blog.save()
    console.log("blog", blogresult)
    user.blogs = user.blogs.concat(blogresult._id)
    const respResult = blogresult.toJSON()

    const userresult = await user.save()
    console.log("user", userresult)

    response.status(201).json(
        {...respResult,
        user:{
            username:userresult.username,
            name:userresult.name,
            id:userresult._id.toString()
        }})

})

blogrouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    console.log("abc", request.params)

    const findblog = await Blog.findById(request.params.id)
    console.log(findblog)
    const bloguser = findblog.user.toString()
    const loginuser = request.user
    console.log("bloguser:", bloguser)
    console.log("loginuser", loginuser)



    if (bloguser === loginuser) {
        const userresp = await User.findById(findblog.user)
        const userblogs = userresp.blogs
        const filteredblogs = userblogs.filter(blog => blog.toString() !== request.params.id)
        console.log(filteredblogs)
        await User.findByIdAndUpdate(userresp._id, { blogs: filteredblogs })

        const resp = await Blog.findByIdAndRemove(request.params.id)

        response.status(201).json(resp)
    }
    else {
        return response.status(401).json({ error: 'invalid user' })
    }
})

blogrouter.delete('/all', async (request, response, next) => {
    const allblogs = await Blog.find({})
    for (let oneblog of allblogs) {
        const eachuser = await User.findById(oneblog.user)
        console.log("eachuser", eachuser)
        const filteredblogs = eachuser.blogs.filter(blog => false)
        console.log('filtered', filteredblogs)
        const user = {
            _id: eachuser._id,
            blogs: []
        }
        console.log("user", user)
        const userresp = await User.findByIdAndUpdate(eachuser._id, user, {
            new: true,
            context: 'query'
        })
        console.log("userresp", userresp)
    }


    const delresp = await Blog.deleteMany({})
    response.status(201).json({ message: "successfuly deleted all", delresp })
})

blogrouter.put('/:id', middleware.userExtractor, async (request, response, next) => {



    const findblog = await Blog.findById(request.params.id)
    console.log(findblog)
    const bloguser = findblog.user.toString()
    const loginuser = request.user
    console.log("bloguser:", bloguser)
    console.log("loginuser", loginuser)

    if (bloguser === loginuser) {
        const updatedblog = request.body
        console.log(updatedblog)
        const blog = {
            title: updatedblog.title,
            author: updatedblog.author,
            url: updatedblog.url,
            likes: updatedblog.likes
        }
        console.log(blog)

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
    } else {
        return response.status(401).json({ error: 'invalid user' })
    }



})


module.exports = blogrouter

