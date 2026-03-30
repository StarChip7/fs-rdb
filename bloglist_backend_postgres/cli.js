require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: null
    // ssl: {
    //   require: false,//true,
    //   rejectUnauthorized: false
    // }
  }
})

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    const [results] = await sequelize.query('SELECT * FROM blogs')
    results.forEach(blog => {
      console.log(`${blog.author}: ${blog.title}, ${blog.likes} likes`)
    })
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()