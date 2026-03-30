const Blog = require('./blog')
const User = require('./user')

User.hasMany(Blog)
Blog.belongsTo(User)

// Ensure `users` table exists before creating `blogs` which references it
User.sync({ alter: true })
Blog.sync({ alter: true })

module.exports = {
  Blog, User
}