const { sequelize } = require('../utils/db')
const { Model, DataTypes } = require("sequelize")

class Blog extends Model {}
Blog.init({
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  author: {
    type: DataTypes.TEXT
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  year: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1991,
            max: new Date().getFullYear()
        }
    }
}, {
  sequelize,
  underscored: true,
  modelName: 'blog'
})

module.exports = Blog
