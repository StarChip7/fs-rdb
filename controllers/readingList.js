const express = require('express')
const { ReadingList } = require('../models')
const models = require('../models')
const { tokenExtractor } = require('../utils/middleware')

const readingListRouter = express.Router()

readingListRouter.post('/', async (req, res) => {
  const { blogId, userId } = req.body
  console.log('Received request to add to reading list:', { blogId, userId })

  if (!blogId || !userId) {
    return res.status(400).json({ error: 'Blog ID and User ID are required' })
  }else if (typeof blogId !== 'number' || typeof userId !== 'number') {
    return res.status(400).json({ error: 'Blog ID and User ID must be numbers' })
  }else if (!await models.Blog.findByPk(blogId)) {
    return res.status(404).json({ error: 'Blog not found' })
  }else if(!await models.User.findByPk(userId)) {
    return res.status(404).json({ error: 'User not found' })
  }

  try {
    const existingEntry = await ReadingList.findOne({ where: { user_id: userId, blog_id: blogId } })
    if (existingEntry) {
      return res.status(400).json({ error: 'Blog already in reading list' })
    }

    const newEntry = await ReadingList.create({ user_id: userId, blog_id: blogId })
    res.status(201).json(newEntry)
  } catch (error) {
    console.error('Error adding to reading list:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

readingListRouter.put('/:id', tokenExtractor, async (req, res) => {
  const { id } = req.params
  const { read } = req.body

  if (typeof read !== 'boolean') {
    return res.status(400).json({ error: 'Read status must be a boolean' })
  }

  try {
    const entry = await ReadingList.findByPk(id)
    if (!entry) {
      return res.status(404).json({ error: 'Reading list entry not found' })
    }

    // Check if the user is the owner of the reading list entry
    if (entry.userId !== req.user.id) {
      return res.status(401).json({ error: 'Forbidden: You can only update your own reading list entries' })
    }

    entry.read = read
    await entry.save()
    res.json(entry)
  } catch (error) {
    console.error('Error updating reading list entry:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})



module.exports = readingListRouter