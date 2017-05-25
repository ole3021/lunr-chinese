const lunr = require('lunr')
const segment = require('nodejieba')

const chineseRegx = /[\u4e00-\u9fa5]/
const chineseTrimmerRegx = /[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]/g

const containChinese = obj => {
  if (!obj) return []

  if (Array.isArray(obj)) {
    return obj.every(str => str.toString().trim().match(chineseRegx))
  } else {
    return obj.toString().trim().match(chineseRegx)
  }
}

const tokenizChinses = obj => {
  if (Array.isArray(obj)) {
    return obj.map(t => new lunr.Token(lunr.utils.asString(t).toLowerCase()))
  }

  const str = obj.toString().trim().toLowerCase()
  const segmentWords = segment.cut(str, true)
  let startIndex = 0

  const segmentTokens = segmentWords.map(word => {
    const token = new lunr.Token(word, {
      position: [startIndex, word.length]
    })
    startIndex += word.length
    return token
  })

  const tokens = segmentTokens
    .filter(token => !token.str.match(lunr.tokenizer.separator))
    .map((token, index) => {
      token['index'] = index
      return token
    })
  return tokens
}

const trimmerChinese = token => {
  return token.update(s => s.replace(chineseTrimmerRegx, ''))
}

lunr._tokenizer = lunr.tokenizer
lunr._trimmer = lunr.trimmer

lunr.tokenizer = function (obj) {
  if (containChinese(obj)) return tokenizChinses(obj)

  return lunr._tokenizer(obj)
}

lunr.trimmer = function (token) {
  if (containChinese(token.str)) return trimmerChinese(token)

  return lunr._tokenizer(token)
}

lunr.tokenizer.separator = lunr._tokenizer.separator

module.exports = lunr
