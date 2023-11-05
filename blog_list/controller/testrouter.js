const testrouter = require('express').Router()
const {Blog,User} = require("../models/index")
const bcrypt = require('bcrypt')

const userList = [
  {
    username: "test1@abc.com",
    name: "Michael Chan",
    password: "password123",
  },
  {
    username: "test2@abc.com",
    name: "Edsger W. Dijkstra",
    password: "pw",
  },
  {
    username: "test3@abc.com",
    name: "Robert C. Martin",
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
      __v: 0,
      year: 2000
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


testrouter.post("/reset", async (request, response, next) => {
  const blogres = await Blog.destroy({
    where:{},
    truncate: true
  });
  console.log(
    "🚀 ~ file: testrouter.js:10 ~ testrouter.post ~ blogres:",
    blogres
  );
  const userres = await User.destroy({
    where:{},
    cascade: true})
  console.log(
    "🚀 ~ file: testrouter.js:11 ~ testrouter.post ~ userres:",
    userres
  );
  let counter = 0;
  
  for (let user of userList) {
    console.log("🚀 ~ file: testrouter.js:66 ~ testrouter.post ~ counter:", counter)
    const passwordHash = await bcrypt.hash(user.password, 10);
    const newuser = User.build({
      username: user.username,
      name: user.name,
      passwordHash: passwordHash,
    });
    const savedUser = await newuser.save();
    const userBlogs = initialBlogs
    .filter(blog => blog.author === user.name)
    .map((blog) => {
      const { _id, __v, ...rest } = blog;
        return { ...rest, userId: savedUser.id }
     })

        const createdBlogs= await Blog.bulkCreate(userBlogs,{validate:true})
        console.log("🚀 ~ file: testrouter.js:111 ~ testrouter.post ~ createdBlogs:", createdBlogs)
        
      

      
      
  
    }

    return response.status(204).end();
    


  

  
});

module.exports =testrouter