const { Sequelize } = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: null
    // ssl: {
    //   require: false,//true,
    //   rejectUnauthorized: false
    // }
  }
})

const migrationConf = {
    migrations: {
        glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
}

const runMigrations = async () => {
    const migrator = new Umzug(migrationConf)

    const migrations = await migrator.up()

    console.log('Migrations up to date', {
        files: migrations.map((mig) => mig.name),
    })
}

const rollbackMigration = async() => {
    await sequelize.authenticate()
    const migrator = new Umzug(migrationConf)
    await migrator.down()
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    await runMigrations()
  } catch (error) {
    console.error('Unable to connect to the database:', error.name, error.message)
    console.error(error)
  }
}

module.exports = {
  connectToDatabase,
  sequelize
}