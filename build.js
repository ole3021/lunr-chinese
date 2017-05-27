const lunr = require('lunr')

lunr.trimmer = token => {
  return token.replace(/^\s+/, '').replace(/\s+$/, '')
}

lunr.Pipeline.registerFunction(lunr.trimmer, 'trimmer')

module.exports = lunr
