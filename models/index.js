const User = require('./user')
const Blog = require('./blog')

User.hasMany(Blog)
Blog.belongsTo(User)

// Ensure `users` table exists before creating `blogs` which references it
User.sync({ alter: true })
Blog.sync({ alter: true })

module.exports = {
  User, Blog
}