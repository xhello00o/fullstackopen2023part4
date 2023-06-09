const express = require("express");
require('express-async-errors')
const app = express();
const cors = require("cors");
const blogrouter = require("./controller/blogrouter");
const middleware = require("./util/middleware");
const config = require("./util/config");
const mongoose = require("mongoose");
const logger = require("./util/logger");
const Blog = require("./models/bloglist")

logger.info(config.MONGO_DB_USER)
logger.info(config.MONGO_DB_PW)
mongoose.set("strictQuery", false);
mongoose
  .connect(
    config.MONGO_DB_URI
  )
  .then((response) => {
    logger.info("DB connected");
  })
  .catch((error) => {
    logger.info("Error Occured");
    logger.error(error);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/blogs',blogrouter)

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app
