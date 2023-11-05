const express = require("express");
require('express-async-errors')
const app = express();
const cors = require("cors");
const blogrouter = require("./controller/blogrouter");
const middleware = require("./util/middleware");
const userrouter = require('./controller/userrouter');
const loginrouter = require('./controller/loginrouter');
const authorRouter = require("./controller/authorrouter");
const readingListRouter = require("./controller/readingListRouter");
const logoutRouter = require('./controller/logoutRouter')




app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);


app.use('/api/login', loginrouter)
app.use('/api/blogs',blogrouter)
app.use('/api/users',userrouter)
app.use('/api/authors',authorRouter)
app.use('/api/readinglists',readingListRouter)
app.use('/api/logout', logoutRouter )
if (process.env.NODE_ENV === 'test') {
  
  console.log('yes')
  const testrouter = require('./controller/testrouter')
  app.use('/api/testing', testrouter)
}




app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app
