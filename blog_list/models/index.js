const Blog = require('./bloglist')
const User = require('./user')
const FavouriteBlogs = require('./favoriteblogs')
const Session = require('./session')


User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog,{through: FavouriteBlogs,as:'fav_blogs'})
Blog.belongsToMany(User, {through:FavouriteBlogs, as:'users_favourite'})

User.hasMany(Session)
Session.belongsTo(User)


/* These are not to be used togethor with the migrations.they are either migrations or sync()
Blog.sync({alter: true})
User.sync({alter: true}) */

module.exports={Blog,User,FavouriteBlogs,Session}