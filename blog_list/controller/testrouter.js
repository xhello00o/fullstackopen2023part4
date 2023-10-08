const testrouter = require('express').Router()
const Blog = require("../models/bloglist")
const User = require('../models/user')
const bcrypt = require('bcrypt')
const Comment = require('../models/comments')

const userList = [
  {
    username: "test1",
    name: "Michael Chan",
    password: "password123",
  },
  {
    username: "test2",
    name: "Edsger W. Dijkstra",
    password: "pw",
  },
  {
    username: "test3",
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


testrouter.post("/reset", async (request, response, next) => {
  const blogres = await Blog.deleteMany({});
  console.log(
    "🚀 ~ file: testrouter.js:10 ~ testrouter.post ~ blogres:",
    blogres
  );
  const userres = await User.deleteMany({});
  console.log(
    "🚀 ~ file: testrouter.js:11 ~ testrouter.post ~ userres:",
    userres
  );
  const commentres = await Comment.deleteMany({})
  console.log("🚀 ~ file: testrouter.js:89 ~ testrouter.post ~ commentres:", commentres)
  let counter = 0;
  
  for (let user of userList) {
    console.log("🚀 ~ file: testrouter.js:66 ~ testrouter.post ~ counter:", counter)
    const passwordHash = await bcrypt.hash(user.password, 10);
    const newuser = new User({
      username: user.username,
      name: user.name,
      passwordHash: passwordHash,
    });
    const savedUser = await newuser.save();
    let blogid = [];
    for (let blogIndex of [counter, counter + 1]) {
      console.log("🚀 ~ file: testrouter.js:78 ~ testrouter.post ~ blogIndex:", blogIndex)
      let blog = new Blog({
        ...initialBlogs[blogIndex],
        user: savedUser._id,
      });
      const blogresp = await blog.save();
      blogid.push(blogresp._id);
    }
    console.log("blogid", blogid);

    const updateduser = {
      _id: savedUser._id,
      blogs: blogid,
    };
    await User.findByIdAndUpdate(savedUser._id, updateduser);

    counter += 2;
  }

  response.status(204).end();
});

module.exports =testrouter