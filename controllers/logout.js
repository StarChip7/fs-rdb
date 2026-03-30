const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../utils/config')
const User = require('../models/user')
const Session = require('../models/session')
const { tokenExtractor } = require('../utils/middleware')

router.delete('/', tokenExtractor, async (req, res) => {
  try {
    const token = req.get('authorization').substring(7)
    await Session.destroy({ where: { token } })
    res.status(204).end()
  } catch (error) {
    console.error('Error during logout:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router