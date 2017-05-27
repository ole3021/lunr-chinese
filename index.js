const lunr = require('lunr')
const segment = require('nodejieba')
const fs = require('fs')

const chineseRegx = /[\u4e00-\u9fa5]/

const containChinese = obj => {
  if (!obj) return []

  if (Array.isArray(obj)) {
    return obj.every(str => str.toString().trim().match(chineseRegx))
  } else {
    return obj.toString().trim().match(chineseRegx)
  }
}

const tokenizChinses = obj => {
  if (Array.isArray(obj)) return obj.map(t => lunr.utils.asString(t))

  const str = obj.toString().trim().toLowerCase()
  return segment.cut(str, true)
}

lunr._tokenizer = lunr.tokenizer
const registerLable = lunr.trimmer.label
lunr.trimmer = token => {
  return token.replace(/^\s+/, '').replace(/\s+$/, '')
}
lunr.trimmer.label = registerLable


lunr.tokenizer = obj => {
  if (!arguments.length || !obj) return []
  if (containChinese(obj)) return tokenizChinses(obj)

  return lunr._tokenizer(obj)
}

lunr.chineseIdx = (idx, data, path) => {
  if (!Array.isArray(data)) return idx

  data.map(content => idx.add(content))
  if (!path) return idx

  fs.writeFile(path, JSON.stringify(idx), err => {
    if (err) throw err
  })
}

lunr.tokenizer.separator = lunr._tokenizer.separator
module.exports = lunr
