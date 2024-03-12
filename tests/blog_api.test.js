const { test, after, describe } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('Backend tests', () => {

  test('Blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('There are two blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 2)
  })

  test('The first blog is a Test Blog', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(e => e.title)
    assert.strictEqual(titles.includes('Test Blog'), true)
  })

  test('Blog identification is id on all blogs', async () => {
    const response = await api.get('/api/blogs')
    const identification = response.body.map(blog => 'id' in blog)
    const allHaveId = identification.every(hasId => hasId)
    assert.strictEqual(allHaveId, true)
  })
})

  
after(async () => {
  await mongoose.connection.close()
})