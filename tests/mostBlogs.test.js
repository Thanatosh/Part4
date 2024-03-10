const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('../models/testBlogs')

describe('Most blogs', () => {

  test('Empty list', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })
  
  test('List of a single blog', () => {
    const singleBlog = [blogs[0]]
    const result = listHelper.mostBlogs(singleBlog)
    assert.strictEqual(result.author, "Michael Chan")
    assert.strictEqual(result.blogs, 1)
  })
    
  test('Most blogs on a larger list of blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.strictEqual(result.author, "Robert C. Martin")
    assert.strictEqual(result.blogs, 3)
  })
})