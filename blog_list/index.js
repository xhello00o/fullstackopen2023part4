const app = require('./app')
const config = require('./util/config')
const logger = require('./util/logger')

logger.info(config.PORT)
app.listen(config.PORT,()=> {
    logger.info(`server running on port ${config.PORT}`)
})