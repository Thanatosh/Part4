const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({ error: 'Username and password must be atleast 3 character long' })
  }

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.username) {
      return response.status(400).json({ error: 'expected `username` to be unique' })
    } else {
      console.error('Error while creating user:', error)
      response.status(500).json({ error: 'An unexpected error occurred' })
    }
  }
})

module.exports = usersRouter