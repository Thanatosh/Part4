const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogControllers')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB: ', error)
})

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})