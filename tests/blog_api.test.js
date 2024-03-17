const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

describe('Backend tests', () => {
  let initialBlogid = []

  const initializeDatabase = async () => {
    await Blog.deleteMany({})
    const insertedBlogs = await Blog.insertMany(helper.initialBlogs)
    initialBlogid = insertedBlogs.map(blog => blog._id.toString())
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

  test('Likes not provided on Blog defaults to 0', async () => {
    const likesBlog = {
      title: "Likes Test",
      author: "Likes Author",
      url: "likesTestURL",
    }

    await api
      .post('/api/blogs')
      .send(likesBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogs = response.body     
    const newBlogInResponse = blogs.find(blog => blog.title === likesBlog.title)
    assert.strictEqual(newBlogInResponse.likes, 0)
  })

  test('Blog without title or URL returns error code 400', async () => {
    const blogWithoutTitle = {
      author: "Test author",
      url: "testURL"
    }
  
    await api
      .post('/api/blogs')
      .send(blogWithoutTitle)
      .expect(400)

    const blogWithoutUrl = {
      title: "Test Title",
      author: "Test author"
    }
    
    await api
      .post('/api/blogs')
      .send(blogWithoutUrl)
      .expect(400)    
  })

  test('Delete blog by ID', async () => {
    const deleteId = initialBlogid[0]
    await api
      .delete(`/api/blogs/${deleteId}`)
      .expect(204)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length - 1)
  })

  test('Update likes on a blog', async () => {
    const updatedLikes = 5
    const blogsBefore = await api.get('/api/blogs')
    const blogToUpdate = blogsBefore.body[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: updatedLikes })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await api.get('/api/blogs')
    const updatedBlog = blogsAfter.body.find(blog => blog.id === blogToUpdate.id)
  
    assert.strictEqual(updatedBlog.likes, updatedLikes)
  })
})
  
after(async () => {
  await mongoose.connection.close()
})