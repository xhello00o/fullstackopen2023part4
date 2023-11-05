const app = require('./app')
const config = require('./util/config')
const { connectToDatabase } = require('./util/dbMigration')
const logger = require('./util/logger')


logger.info(config.PORT)

const start = async() => {
    await connectToDatabase()
    app.listen(config.PORT,()=> {
        logger.info(`server running on port ${config.PORT}`)
    })

}

start()