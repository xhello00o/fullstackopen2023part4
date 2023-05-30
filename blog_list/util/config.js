require('dotenv').config()

const PORT = 3003
const MONGO_DB_PW = process.env.MONGO_DB_PW
const MONGO_DB_USER = process.env.MONGO_DB_USER

module.exports ={ PORT, MONGO_DB_PW,MONGO_DB_USER}
