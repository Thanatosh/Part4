const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  let mostLikes = blogs[0]

  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > mostLikes.likes) {
      mostLikes = blogs[i]
    }
  }
  
  return {
    title: mostLikes.title,
    author: mostLikes.author,
    likes: mostLikes.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const blogCounts = lodash.groupBy(blogs, 'author')
  const maxAuthor = lodash.maxBy(lodash.keys(blogCounts), (author) => blogCounts[author].length)
  const maxBlogs = blogCounts[maxAuthor].length

  return {
    author: maxAuthor,
    blogs: maxBlogs
  }
}
  
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}