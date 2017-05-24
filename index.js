const lunr = require('lunr')
const segment = require('nodejieba')

const containChinese = obj => {
  if (!obj) return []

  const chineseRegx = /[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/

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
    // console.log('>>> tok', tokens);
  return tokens
}

lunr._tokenizer = lunr.tokenizer

lunr.tokenizer = function (obj) {
  if (containChinese(obj)) return tokenizChinses(obj)

  return lunr._tokenizer(obj)
}

lunr.tokenizer.separator = lunr._tokenizer.separator

module.exports = lunr
