const blogrouter = require('express').Router()
const { response } = require('../app')
const Blog = require("../models/bloglist")



blogrouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({})
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
    const blog = new Blog(request.body)
    console.log(blog)

    if (!blog.url ||blog.url===""||!blog.title|| blog.title ===""){
        response.status(400).end()
    }
    if (!blog.likes || blog.likes ===""){
        blog.likes = 0 
        
    }


    const result = await blog.save()
    response.status(201).json(result)

})

blogrouter.delete('/:id', async (request,response,next)=> {
    console.log("abc",request.params)
    const resp = await Blog.findByIdAndRemove(request.params.id)
    
    response.status(204).json(resp)
})

blogrouter.put('/:id', async (request,response,next)=> {
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
    console.log("test",result)
    response.status(200).json(result)

})


module.exports = blogrouter

