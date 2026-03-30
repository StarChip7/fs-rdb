const express = require('express')
const models = require('../models')
const { sequelize } = require('../utils/db')


const testRouter = express.Router()
//POST /api/reset that empties both the database tables
testRouter.post('/api/reset', async (req, res) => {
  await sequelize.sync({ force: true })
  res.status(204).end()
})

testRouter.get('/', async (req, res) => {
  res.status(200).end()
})

module.exports = testRouter