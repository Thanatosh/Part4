const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogControllers')

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI)
    logger.info('Connected to MongoDB')
  } catch (error) {
    logger.error('Error connecting to MongoDB: ', error)
  }
}

connectToMongoDB()

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app