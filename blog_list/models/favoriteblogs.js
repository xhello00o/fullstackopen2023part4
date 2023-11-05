const { Model, DataTypes} = require('sequelize')
const {sequelize} = require('../util/dbMigration')

class FavouriteBlogs extends Model {}
FavouriteBlogs.init({
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }, blog_id :{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model:'blogs',
            key:'id'
        }
    }, user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },marked_read:{
        type:DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
       
    }
},{sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'favourite_blogs'

})

module.exports = FavouriteBlogs