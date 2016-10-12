// module.exports = {
//   web: require('./web'),
//   admin: require('./admin')
// }

const importDir = require('import-dir')
const modelConfigs = [{ folder: 'web' }, { folder: 'admin' }]
let Model = {}
modelConfigs.reduce((prev, curr) => {
  Model[`${curr.folder}`] = importDir(`./${curr.folder}`)
}, [])

module.exports = Model
