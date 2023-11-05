const {Sequelize}  = require('sequelize')
const {POSTGRES_URL} = require('./config')
const {Umzug,SequelizeStorage} = require('umzug')

const sequelize = new Sequelize(POSTGRES_URL)


const migrationConfig = 
    {
        migrations :{
            glob: 'migrations/*.js'
        },
        storage: new SequelizeStorage({sequelize, tableName:'migrations'}),
        context : sequelize.getQueryInterface(),
        logger: console,
    }
  


const runMigration = async () => {
    const migrator = new Umzug(migrationConfig)

    const migrations = await migrator.up()
    console.log('migrations up to date',{
        files: migrations.map((mig)=>mig.name),
    })
}

const rollbackMigrations = async () => {
    await sequelize.authenticate()
    const migrator = new Umzug(migrationConfig)
    await migrator.down()
    sequelize.close()

}

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        await runMigration()
        console.log(`connected to the database`)
    } catch (err) {
        console.log('failed to connect to the database')
        console.error(err)
        return process.exit(1)
    }
}

module.exports = {connectToDatabase , sequelize , rollbackMigrations}