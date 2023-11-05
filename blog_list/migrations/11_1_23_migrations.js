const {DataTypes} = require('sequelize')

module.exports = {
    up: async ({context:queryInterface}) => {
        await queryInterface.createTable('favourite_blogs',{
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
        })

    },
    down: async ({context:queryInterface}) => {
        await queryInterface.dropTable('favourite_blogs')

    }
}
