const Blog = require('./blog')
const User = require('./user')
const Session = require('./session')
const ReadingList = require('./readingList')

User.hasMany(Blog)
Blog.belongsTo(User)

// Ensure `users` table exists before creating `blogs` which references it
// User.sync({ alter: true })
// Blog.sync({ alter: true })

User.hasMany(Session)
Session.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'marked_blogs' })
Blog.belongsToMany(User, { through: ReadingList, as: 'users_marked' })

module.exports = {
  User, Blog, ReadingList, Session
}