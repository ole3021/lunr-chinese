# lunr-chinese
Lunr addon, do words segment with nodejieba locally.

# usage
```JavaScript
const lunr = require('lunr-chinese')

let idx = lunr(function() {
  this.ref('id')

  this.field('title', { boost: 10 })
  this.field('categories')
  this.field('body')
})

contents.map(content => idx.add(content))

// get the Lunr instance(use locally)
const lunrCn = lunr.chineseIdx(idx, postContents)
lunrCn.search('例子')

// generate the Lunr Index file
lunr.chineseIdx(idx, postContents, 'path/lunrCnIndexs.json')
```

Load and work with generated index file.

```JavaScript
// load `lunr` from lunr-chinese.js

var lunrCnIndexs = JSON.parse(lunrCnIndexsString)
var chineseLunr = lunr.Index.load(lunrCnIndexs)

chineseLunr.search('例子')
```
