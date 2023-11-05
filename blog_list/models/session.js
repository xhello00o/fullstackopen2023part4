const {DataTypes,Model} = require('sequelize')
const {sequelize} = require('../util/dbMigration')

class Session extends Model {}
Session.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement:true

    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull:false,

    }
}, {sequelize,
    underscored:true,
    timestamps:true,
    modelName: 'session'
})

module.exports = Session