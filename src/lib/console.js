'use stric'

/**
 * @type {{ line: any }}
 */
const log = (...arg) => console.log(...arg)
Object.defineProperty(log, 'line', {
  set(val) {
    console.log(val)
  }
})

module.exports = {
  log
}
