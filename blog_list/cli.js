require('dotenv').config()
const {Sequelize,Model, QueryTypes}=require('sequelize')



const sequelize= new Sequelize(process.env.DATABASE)

const main = async () => {
    
    try {
        await sequelize.authenticate()
        const blogs = await sequelize.query("SELECT* from blogs",{
            type:QueryTypes.SELECT
        })
        console.log(blogs)
        sequelize.close()
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}



main()


