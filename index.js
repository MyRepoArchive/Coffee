const cp = require('child_process')
const del = require('del')

console.clear()
del('./dist')

cp.exec('yarn tsc', (err, _stdout, stderr) => {
  if (err) {
    console.error(err)
  } else if (stderr) {
    console.error(stderr)
  } else {
    require('./dist')
  }
})
