const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('../models/testBlogs')

describe('Most likes', () => {

  test('Empty list', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('Likes on a single blog', () => {
    const singleBlog = [blogs[0]]
    const result = listHelper.favoriteBlog(singleBlog)
    assert.strictEqual(result.title, "React patterns")
    assert.strictEqual(result.author, "Michael Chan")
    assert.strictEqual(result.likes, 7)
  })
  
  test('Most liked of all the blogs', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual(result.title, "Canonical string reduction")
    assert.strictEqual(result.author, "Edsger W. Dijkstra")
    assert.strictEqual(result.likes, 12)
  })
})