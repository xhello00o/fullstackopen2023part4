const testrouter = require("express").Router();
const Blog = require("../models/bloglist");
const User = require("../models/user");
const bcrypt = require("bcrypt");

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

const anecdoteList = [
  {
    content: "If it hurts, do it more often",
    votes: 6,
  },
  {
    content: "Adding manpower to a late software project makes it later!",
    votes: 13,
  },
  {
    content:
      "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    votes: 8,
  },
  {
    content:
      "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    votes: 7,
  },
  {
    content: "Premature optimization is the root of all evil.",
    votes: 0,
  },
  {
    content:
      "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    votes: 0,
  },
];

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
        ...anecdoteList[blogIndex],
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


module.exports = testrouter;
