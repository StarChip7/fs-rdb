const { connectToDatabase } = require('./utils/db')
const models = require('./models')
const express = require('express')
const app = express()

const { errorHandler } = require('./utils/middleware')

const blogsRouter = require('./controllers/blogs')
const router = require('./controllers/users')
const loginRouter = require('./controllers/login')

const main = async () => {
  try {
    await connectToDatabase()

    app.use(express.json())
    app.use(express.static('build'))
    app.use('/api/users', router)
    app.use('/api/login', loginRouter)
    app.use('/api/readinglists', require('./controllers/readingList'))
    app.use('/api/logout', require('./controllers/logout'))
    app.use('/api/blogs', blogsRouter)
    app.use('/api/authors', require('./controllers/authors'))
    app.use('', require('./controllers/testing'))
    app.use(errorHandler)

    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()