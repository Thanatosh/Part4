const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

describe('Backend tests', () => {

  const initializeDatabase = async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  }

  beforeEach(async () => {
    await initializeDatabase()
  })

  test('Blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('There are 2 blogs', async () => {
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

  test('Posting a new blog', async () => {
    const newBlog = {
      title: "Test Posting Blog",
      author: "Test Person mk.III",
      url: "postTestURL",
      likes: 23,
    }

    const original = await api.get('/api/blogs')

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogs = response.body

    assert.strictEqual(blogs.length, original.body.length + 1)
    
    const newBlogInResponse = blogs.find(blog => blog.title === newBlog.title)
    assert(newBlogInResponse !== undefined)
  })
})
  
after(async () => {
  await mongoose.connection.close()
})