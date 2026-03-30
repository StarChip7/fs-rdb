const express = require('express')
const { Blog } = require('../models/index')
const { tokenExtractor } = require('../utils/middleware')
const { User } = require('../models/index')
const { Op } = require("sequelize");

const blogsRouter = express.Router()

const blogFinder = async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' })
  }
  req.blog = blog
  next()
}

blogsRouter.get('/', async (req, res) => {

  const where = {}

  if (req.query.search) {
    where.title = {
      [Op.substring]: req.query.search
    }
  }
  const blogs = await Blog.findAll(
    {
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where
  }
  )
  res.json(blogs)
})

blogsRouter.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.create({ ...req.body, userId: req.decodedToken.id })
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  // Ensure that the user can only delete their own blogs
  if (req.blog.userId !== req.decodedToken.id) {
    return res.status(403).json({ error: 'Forbidden: You can only delete your own blogs' })
  }
  const id = req.params.id
  await Blog.destroy({ where: { id } })
  res.status(204).end()
})

blogsRouter.put('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
  const blog = req.blog
  try {
    blog.likes = req.body.likes
    await blog.save()
    res.json(blog)
  } catch (error) {
    next(error)
  }
})


module.exports = blogsRouter