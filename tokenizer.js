const fs = require('fs')
const lunr = require('./index')

console.log('>>> start generate idx_cn...')

fs.readFile('./data-cn.json', (err, data) => {
  if (err) throw err

  const raw = JSON.parse(data)

  const postContents = raw.posts.map(post => ({
    url: post.url,
    title: post.title,
    body: post.body,
    categories: post.categories.join(' ')
  }))

  let idx = lunr(function () {
    this.ref('url')

    this.field('title', { boost: 10 })
    this.field('categories')
    this.field('body')
  })

  postContents.map(content => idx.add(content))

  // work
  console.log('>>> 卡', idx.search('卡'));

  const xxx = lunr.chineseIdx(idx, postContents)
  console.log('>>>xx', xxx.search('卡'))

  lunr.chineseIdx(idx, postContents, './index-cn.json')
})
