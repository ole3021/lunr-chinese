const lunr = require('lunr')

lunr.trimmer = function(token) {
  return token.replace(/^\s+/, '').replace(/\s+$/, '')
}

lunr.Pipeline.registerFunction(lunr.trimmer, 'trimmer')

module.exports = lunr
