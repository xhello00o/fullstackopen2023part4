const {POSTGRES_URL} = require('./config')
const {Sequelize} = require('sequelize')


console.log(POSTGRES_URL)
const sequelize = new Sequelize(POSTGRES_URL)

const connectToDatabase = async () => {
    try{
        await sequelize.authenticate()
        console.log('connected to database')
    } catch (err) {
        console.log(`failed to connect to database:`,err)
        return process.exit(1)

    }

    return null 
}

module.exports = {connectToDatabase, sequelize}

