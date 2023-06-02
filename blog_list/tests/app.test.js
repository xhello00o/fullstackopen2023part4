const mongoose = require('mongoose')
const supertest = require("supertest")
const app = require('../app')
const api = supertest(app)
const Blog = require("../models/bloglist")

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    for (let eachblog of initialBlogs) {
        let blog = new Blog(eachblog)
        await blog.save()
    }
})


describe(`HTTP GET`, () => {
    test('notes are returned as json ', async () => {
        const resp = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)




    })
    test('notes have the correct length ', async () => {
        const resp = await api
            .get('/api/blogs')


        expect(resp.body).toHaveLength(initialBlogs.length)


    })

    test('Unique Identifier is Id ', async () => {
        const resp = await api
            .get('/api/blogs')

        console.log(resp.body)
        const blogid = (resp.body).map(blog => blog.id)
        console.log(blogid)
        expect(blogid).toBeDefined()

    })



})

describe(`HTTP POST`, () => {
    const testnote = {
        title: "test",
        author: "test",
        url: "test",
        likes:1
    }

    const testnote2 = {
        title: "test",
        author: "test",
        url: "test",
    }

    const testnote3 = {
        author: "test",
        url: "test",
        likes:1
    }

    const testnote4 = {
        title: "test",
        author: "test",
        likes:1
    }
    test('test note is created successfully',async ()=>{
        const postresp = await api.post('/api/blogs').send(testnote)

        console.log(postresp.body)
        expect(postresp.body).toMatchObject(testnote)

        const getresp = await api.get('/api/blogs')
        expect(getresp.body).toHaveLength(initialBlogs.length +1 )


    })
    test('missing likes is default set to 0',async ()=>{
        const postresp = await api.post('/api/blogs').send(testnote2)

        console.log(postresp.body)
        expect(postresp.body).toMatchObject({...testnote,likes:0})

        const getresp = await api.get('/api/blogs')
        expect(getresp.body).toHaveLength(initialBlogs.length +1 )


    })
    test('missing title/url error 400 is return',async ()=>{
        await api.post('/api/blogs')
        .send(testnote3)
        .expect(400)

    
         await api.post('/api/blogs')
        .send(testnote4)
        .expect(400)
        
    })

})

describe(`HTTP DELETE`, ()=> {
    const testnote = initialBlogs[0]
    console.log(testnote)
    test ('succesfully deleted the correct entry', async ()=>{
         await api.delete(`/api/blogs/${testnote._id}`)

        
        const getresp = await api.get('/api/blogs')
        expect(getresp.body).toHaveLength(initialBlogs.length-1)

         await api.get(`/api/blogs/${testnote._id} `)
        .expect(404)
        
    })
    

})

describe(`HTTP PUT`, ()=> {
    const testnote = {...initialBlogs[0], likes: initialBlogs[0].likes +1}
    const testnote2 ={ _id:'test'}
    test.only ('succesfully updated the correct entry', async ()=>{
        const putresp = await api.put(`/api/blogs/${testnote._id}`).send(testnote)
        
        console.log("updated",putresp.body)
        expect(putresp.body.likes).toBe(initialBlogs[0].likes +1)

              
        const putresp2 = await api.put(`/api/blogs/${testnote._id}`).send(testnote2)
        /expect(500)
        console.log("wrong id",putresp2)
       

        
    })
    

})


afterAll(async () => {
    await mongoose.connection.close()
})