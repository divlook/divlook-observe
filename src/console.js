'use stric'

/**
 * @type {{ line: any }}
 */
export const log = (...arg) => console.log(...arg)
Object.defineProperty(log, 'line', {
  set(val) {
    console.log(val)
  }
})

export default log