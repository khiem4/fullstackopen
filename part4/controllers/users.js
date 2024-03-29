const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')



userRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', {
      title: 1,
      author: 1,
      url:1,
      likes:1
    })
  response.json(users)
})


userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const existingUser = await User.findOne({ username })

  if(existingUser) {
    return response.status(400).json({
      error: 'user name must be unique' })
  }

  if(password.length < 3) {
    return response.status(400).json({
      error: 'minimum password length must be 3'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})


userRouter.delete('/:id' , async (request, response) => {
  await User.findByIdAndRemove(request.params.id)
  response.status(204).end()

})


module.exports = userRouter