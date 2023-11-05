const {Model, DataTypes}=require('sequelize')
const {sequelize} = require('../util/dbMigration')

class User extends Model {}
User.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username:{
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate:{
            isEmail: true 
        }
    },
    name:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    passwordHash:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
     }, {sequelize, 
    underscored: true,
    timestamps: true,
    modelName: 'user'}
)

module.exports = User