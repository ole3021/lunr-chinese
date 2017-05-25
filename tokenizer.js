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

  let oo = null
  let idx = lunr(function () {
    oo = this
    this.ref('url')

    this.field('title', { boost: 10 })
    this.field('categories', { boost: 100 })
    this.field('body')
    postContents.forEach(content => this.add(content))
  })

  fs.writeFile('./index-cn.json', JSON.stringify(idx), err => {
    if (err) throw err

    console.log('>>>> idx >>>', oo);
    console.log('>>> idx_cn generate complete!')
    console.log('>>> search content for 牛奶', idx.search('牛奶'))
    console.log('>>> search content for 冰摇', idx.search('冰摇'))
    console.log('>>> search title for 黄金时代', idx.search('黄金时代'))
    console.log('>>> search category for Beverage', idx.search('Beverage'))
  })
})
