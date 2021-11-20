const cp = require('child_process')

cp.exec('yarn tsc', (err, _stdout, stderr) => {
  if (err) {
    console.error(err)
  } else if (stderr) {
    console.error(stderr)
  } else {
    require('./dist')
  }
})
