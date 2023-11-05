const {DataTypes} = require('sequelize')

module.exports = {
    up: async({context:queryInterface} ) => {
        await queryInterface.createTable('blogs',{
            
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
                created_at:{
                    type: DataTypes.DATE,
                },
                updated_at: {
                    type: DataTypes.DATE
                }
            
        })
        await queryInterface.createTable('users',{
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
            password_hash:{
                type: DataTypes.TEXT,
                allowNull: false
            },
            created_at:{
                type: DataTypes.DATE,
            },
            updated_at: {
                type: DataTypes.DATE
            }
        })

        await queryInterface.addColumn('blogs','user_id',{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', key:'id'
            }
        })
    }, 
    down : async ({context:queryInterface})=> {
        await queryInterface.dropTable('blogs')
        await queryInterface.dropTable('users')
    }
}