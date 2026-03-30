const express = require('express')
const { Blog } = require('../models')
const { tokenExtractor } = require('../utils/middleware')
const { User } = require('../models')
const { Op } = require("sequelize");

const authorsRouter = express.Router()

authorsRouter.get('/', async (req, res) => {
  // order by likes in descending order
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [Blog.sequelize.fn('COUNT', Blog.sequelize.col('id')), 'articles'],
      [Blog.sequelize.fn('SUM', Blog.sequelize.col('likes')), 'likes']
    ],
    group: ['author'],
    order: [[Blog.sequelize.fn('SUM', Blog.sequelize.col('likes')), 'DESC']]
  })
  res.json(authors)
})

module.exports = authorsRouter