const mongoose = require('mongoose')
const supertest = require("supertest")
const app = require('../app')
const api = supertest(app)
const Blog = require("../models/bloglist")
const User = require("../models/user")
const bcrypt = require('bcrypt')

const testusers = [
    {
        _id: "64801d5a7b677bd4f2e5efd8",
        username: "root",
        name: "testroot",
        password: "password123",
        __v: 0
    },
    {
        username: "root1",
        name: "testroot",
        password: "pw",
    },
    {
        username: "root2",
        name: "testroot",
        password: "passwordis123",
    },
];

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
    let blogid = []
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash(testusers[0].password, 10)

    const newuser = new User({
        _id: testusers[0]._id,
        username: testusers[0].username,
        name: testusers[0].name,
        __v: 0,
        passwordHash: passwordHash
    })

    const savedUser = await newuser.save()


    const passwordHash2 = await bcrypt.hash(testusers[2].password, 10)

    const newuser2 = new User({
        _id: testusers[2]._id,
        username: testusers[2].username,
        name: testusers[2].name,
        __v: 0,
        passwordHash: passwordHash2
    })

     await newuser2.save()


    
    for (let eachblog of initialBlogs) {
        let blog = new Blog({
            ...eachblog,
            user: savedUser._id
        })
        const blogresp = await blog.save()
        blogid.push(blogresp._id)
    }
    console.log("blogid", blogid)

    const updateduser = {
        _id: savedUser._id,
        blogs: blogid
    }
    await User.findByIdAndUpdate(savedUser._id, updateduser)

})



describe(`HTTP /api/blogs GET`, () => {
    test('notes are returned as json', async () => {
        const resp = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)




    })
    test('notes have the correct length', async () => {
        const resp = await api
            .get('/api/blogs')


        expect(resp.body).toHaveLength(initialBlogs.length)


    })

    test('Unique Identifier is Id', async () => {
        const resp = await api
            .get('/api/blogs')

        console.log(resp.body)
        const blogid = (resp.body).map(blog => blog.id)
        console.log(blogid)
        expect(blogid).toBeDefined()

    })



})

describe(`HTTP /api/blogs POST`, () => {
    const testnote = {
        title: "test",
        author: "test",
        url: "test",
        likes: 1
    }

    const testnote2 = {
        title: "test",
        author: "test",
        url: "test",
    }

    const testnote3 = {
        author: "test",
        url: "test",
        likes: 1
    }

    const testnote4 = {
        title: "test",
        author: "test",
        likes: 1
    }
    test('testnote is created successfully to the correct user', async () => {
        const loginresp = await api.post('/api/login').send(testusers[0])
        console.log(loginresp)
        const token = loginresp.body.token
        console.log("token",token)
        const postresp = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(testnote)

        console.log(postresp.body.user.toString())
        expect(postresp.body).toMatchObject(testnote)
        expect(postresp.body.user.toString()).toBe("64801d5a7b677bd4f2e5efd8")

        const getcreatedblogresp = await User.findById(postresp.body.user)
        expect(getcreatedblogresp.blogs).toHaveLength(initialBlogs.length + 1)

        const getresp = await Blog.find({})
        expect(getresp).toHaveLength(initialBlogs.length + 1)
    


    })
    test('missing likes is default set to 0', async () => {
        const loginresp = await api.post('/api/login').send(testusers[0])
        console.log(loginresp)
        const token = loginresp.body.token
        console.log("token",token)
        const postresp = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(testnote2)

        console.log(postresp.body)
        expect(postresp.body).toMatchObject({ ...testnote, likes: 0 })

        const getresp = await Blog.find({})
        expect(getresp).toHaveLength(initialBlogs.length + 1)


    })
    test('missing title/url error 400 is return', async () => {
        const loginresp = await api.post('/api/login').send(testusers[0])
        console.log(loginresp)
        const token = loginresp.body.token
        console.log("token",token)

        await api.post('/api/blogs').set('Authorization', `Bearer ${token}`)
            .send(testnote3)
            .expect(400)

        await api.post('/api/blogs').set('Authorization', `Bearer ${token}`)
            .send(testnote4)
            .expect(400)

    })

    test('verify adding blog w/o token response code', async()=>{
        await api.post('/api/blogs').set('Authorization', `Bearer `)
            .send(testnote)
            .expect(401)

    })

})

describe(`HTTP /api/blogs DELETE`, () => {
    const testnote = initialBlogs[0]
    console.log(testnote)
    test('succesfully deleted the correct entry', async () => {
        const loginresp = await api.post('/api/login').send(testusers[0])
        console.log(loginresp)
        const token = loginresp.body.token
        console.log("token",token)
        await api.delete(`/api/blogs/${testnote._id}`).set('Authorization', `Bearer ${token}`)


        const getresp = await Blog.find({})
        expect(getresp).toHaveLength(initialBlogs.length - 1)

        const userresp = await User.findById(testusers[0]._id)
        expect(userresp.blogs).not.toContain(testnote._id)

        await api.get(`/api/blogs/${testnote._id} `)
            .expect(404)

    })

    test('Users only delete their own blogs',async()=>{
        const loginresp = await api.post('/api/login').send(testusers[2])
        console.log(loginresp)
        const token = loginresp.body.token
        console.log("token",token)
        const delresp = await api.delete(`/api/blogs/${testnote._id}`).set('Authorization', `Bearer ${token}`).expect(401)
        expect(delresp.body.error).toContain("invalid user")

        const getblogs = await Blog.find({})
        console.log(getblogs)
        expect(getblogs).toHaveLength(initialBlogs.length)

        const getaffecteduser = await User.findById(testusers[0]._id)
        expect(getaffecteduser.blogs).toHaveLength(initialBlogs.length)


    })


})

describe(`HTTP /api/blogs PUT`, () => {
    const testnote = { ...initialBlogs[0], likes: initialBlogs[0].likes + 1 }
    test('succesfully updated the correct entry', async () => {
        const loginresp = await api.post('/api/login').send(testusers[0])
        console.log(loginresp)
        const token = loginresp.body.token
        console.log("token",token)

        const putresp = await api.put(`/api/blogs/${testnote._id}`).set('Authorization', `Bearer ${token}`).send(testnote)
        console.log("updated", putresp.body)
        expect(putresp.body.likes).toBe(initialBlogs[0].likes + 1)

    })


})

describe('Users HTTP POST', () => {



    test('verify invalid duplicate username', async () => {
        const resp = await api.post('/api/users').send(testusers[0]).expect(400)
        console.log(resp.body)
        expect(resp.body.error).toContain('User validation failed')

        const getresp = await api.get('/api/users')
        expect(getresp.body).toHaveLength(1)

    })

    test('verify invalid password', async () => {
        const resp = await api.post('/api/users').send(testusers[1]).expect(400)
        console.log(resp.body)
        expect(resp.body.error).toContain('invalid password')

        const getresp = await api.get('/api/users')
        expect(getresp.body).toHaveLength(1)

    })


})


afterAll(async () => {
    await mongoose.connection.close()
})