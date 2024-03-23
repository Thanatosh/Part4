const blogsRouter = require('express').Router()
const blog = require('../models/blog')
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate({
      path: 'user',
      select: '-blogs'
    })
    response.json(blogs)
  } catch (error) {
    logger.error('Error while receiving data: ', error)
  }
})

blogsRouter.post('/', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const firstUser = await User.findById(decodedToken.id)
    
    const newblog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes || 0,
      user: firstUser._id
    })

    const savedBlog = await newblog.save()

    await User.findByIdAndUpdate(firstUser._id, { $addToSet: { blogs: savedBlog._id } })
    response.status(201).json(savedBlog)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name ===  'JsonWebTokenError') {
      return response.status(400).json({ error: 'token missing or invalid'})
    }  
    logger.error('Error while posting data: ', error)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const blogToDelete = await Blog.findById(request.params.id)
    if (!blogToDelete) {
      return response.status(404).json({ error: 'blog not found' })
    }
    
    if (blogToDelete.user.toString() !== decodedToken.id) {
      return response.status(403).json({ error: 'unauthorized access' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    logger.error('Error while deleting blog: ', error)
    response.status(500).json({ error: 'internal server error' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes: request.body.likes }, { new: true })
    response.json(updatedBlog)
  } catch (error) {
    logger.error('Error while updating blog: ', error)
  }
})

module.exports = blogsRouter