const authorRouter = require('express').Router()
const {sequelize} = require('../util/db')
const { Blog, User } = require("../models/index");
const {Op} = require('sequelize');
const { request, response } = require('../app');

authorRouter.get('/', async (request,response)=> {

    const authorLikes = await Blog.findAll({
        attributes: [
            'author',
            [sequelize.fn("SUM",sequelize.col('likes')), 'total likes'],
            [sequelize.fn("count", sequelize.col('id')), 'articles']
        ],
        group: "author"
    })

    response.status(200).json(authorLikes)

})

module.exports = authorRouter