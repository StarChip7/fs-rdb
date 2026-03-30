const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const models = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      req.user = await models.User.findByPk(req.decodedToken.id)
      if (!req.user) {
        return res.status(401).json({ error: 'user not found' })
      }
      if (req.user.disabled) {
        return res.status(403).json({ error: 'user disabled' })
      }
      const session = await models.Session.findOne({ where: { token: authorization.substring(7) } })
      if (!session) {
        return res.status(401).json({ error: 'token invalid' })
      }
      
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).send({ error: error.message })
  }

  return response.status(400).json({ error: 'BAD REQUEST' })

  next(error)
}

module.exports = {
  errorHandler,
  tokenExtractor
}