const User = require('../models/user')

const initialBlogs = [
  {
    title: "Test Blog",
    author: "Test Person",
    url: "testURL",
    likes: 0,
  },
  {
    title: "Another Blog",
    author: "Another Person",
    url: "secondTestURL",
    likes: 3,
  }
]

const usersInDb = async () => {
  const users = await User.find ({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  usersInDb
}