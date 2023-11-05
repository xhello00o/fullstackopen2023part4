const readingListRouter = require("express").Router();
const middleware = require("../util/middleware");
const { FavouriteBlogs } = require("../models/index");

readingListRouter.post(
  "/",
  middleware.userExtractor,
  async (req, res, next) => {
    const blog_id = req.body.blog_id;
    const user_id = req.user;
    const id = parseInt(String(blog_id) + String(user_id));
    const addedFavourites = await FavouriteBlogs.create({
      id,
      blog_id,
      user_id,
    });
    res.status(201).json(addedFavourites);
  }
);

readingListRouter.put(
  "/:blog_id",
  middleware.userExtractor,
  async (req, res, next) => {
    const blog_id = req.params.blog_id;
    const user_id = req.user
    const connection_id =parseInt(String(blog_id) + String(user_id));
    console.log(
      "🚀 ~ file: readingListRouter.js:20 ~ readingListRouter.put ~ connection_id:",
      connection_id
    );
    const connection = await FavouriteBlogs.findByPk(connection_id);

    if (!connection) {
      const error = new Error("Not Found");
      error.status = 500;
      error.statusMessage = "Not Found";

      next(error);
    }
    const connUpdate = await connection.update({
      marked_read: true,
    });

    res.status(200).json(connUpdate);
  }
);

module.exports = readingListRouter;
