const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('../models/testBlogs')

describe('Total likes', () => {

  test('Empty list', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('List of a single blog', () => {
    const singleBlog = [blogs[0]]
    const result = listHelper.totalLikes(singleBlog)
    assert.strictEqual(result, 7)
  })
  
  test('Sum of all likes on the blogs', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})