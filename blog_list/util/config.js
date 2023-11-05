require('dotenv').config()

const PORT = process.env.PORT || 3003
const POSTGRES_URL = process.env.DATABASE_URL


module.exports ={ PORT, POSTGRES_URL }
