'use stric'

const {
  log
} = require('./console')

const defaultOtions = {
  watch: {}
}

const Observe = (data = {}, {
  watch = defaultOtions.watch
} = defaultOtions) => {
  /**
   * @type {{ data: {}, set: (data: {}) => void }}
   */
  let observe = {
    data,
    get set() {}
  }

  // set property 선언
  Object.defineProperty(observe, 'set', {
    enumerable: false,
    configurable: false,
    get() {
      return (cb) => {
        let insert
        if (typeof cb === 'function')
          insert = cb(data)
        else if (typeof cb === 'object' && cb !== null)
          insert = cb
        else
          return

        execWatchMethods(insert)
      }
    },
  })

  /**
   * 1단계 객체로 변환.
   * @param {{}} obj 원본 객체
   * @param {{}} [result] 반환되는 객체
   * @param {string[]} [keyname]
   * @returns {{[key: string]: ['oldVal', 'newVal']}}
   */
  const object2level1 = (obj, result = {}, keyname = []) => {
    if (typeof obj === 'object' && obj !== null && JSON.stringify(obj) !== '{}') {
      for (let key in obj) {
        let childVal = obj[key]
        object2level1(childVal, result, keyname.concat(key))
      }
    } else {
      result[keyname.join('.')] = [eval(`data.${keyname.join('.')}`), obj]
    }
    return result
  }

  /**
   * watch에 등록된 객체가 입력되면 실행.
   * @param {{}} inputData
   */
  const execWatchMethods = (inputData) => {
    let resultObj = object2level1(inputData)
    for (let key in resultObj) {
      if (key in watch) {
        let fn = watch[key]
        fn.length === 1 ? fn(resultObj[key][1]) : fn(...resultObj[key])
      }
    }
    return Object.assign(data, inputData)
  }

  return observe
}

module.exports = {
  Observe
}