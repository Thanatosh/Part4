const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('../models/testBlogs')

describe('Most likes', () => {

  test('Empty list', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })
  
  test('List of a single blog', () => {
    const singleBlog = [blogs[0]]
    const result = listHelper.mostLikes(singleBlog)
    assert.strictEqual(result.author, "Michael Chan")
    assert.strictEqual(result.likes, 7)
  })
    
  test('Most likes on a larger list of blogs', () => {
    const result = listHelper.mostLikes(blogs)
    assert.strictEqual(result.author, "Edsger W. Dijkstra")
    assert.strictEqual(result.likes, 17)
  })
})