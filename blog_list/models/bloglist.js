
const {Model, DataTypes}=require('sequelize')
const {sequelize} = require('../util/dbMigration')

class Blog extends Model {}
Blog.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    author:{
        type: DataTypes.TEXT
    },
    url:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    title:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    year:{
        type: DataTypes.INTEGER,
        allowNull: true,
        validate:{
            min: 1991,
            max: new Date().getFullYear(), 
        }
    }
}, {sequelize, 
    underscored: true,
    timestamps: false,
    modelName: 'blog'
})

module.exports = Blog