'use stric'

const defaultOtions = {
  watch: {}
}

const Observe = (data = {}, {
  watch = defaultOtions.watch
} = defaultOtions) => {

  /**
   * getter/setter 등록
   * @param {{}} origin 원본 객체
   * @param {{}} result 등록할 객체
   * @param {string[]} keyname key 배열
   */
   const regObserve = (origin, result = {}, keyname = []) => {
    for (let key in origin) {
      let val = origin[key]
      if (isObject(val)) {
        regObserve(val, result[key], keyname.concat(key))
      } else {
        Object.defineProperty(result, key, {
          get() {
            return val
          },
          set(value) {
            execWatchMethods(object2level1(value, {}, keyname.concat(key)))
            val = value
          }
        })
      }
    }
  }

  /**
   * 1단계 객체로 변환.
   * @param {{}} obj 원본 객체
   * @param {{}} [result] 반환되는 객체
   * @param {string[]} [keyname]
   * @returns {{[key: string]: ['oldVal', 'newVal']}}
   */
  const object2level1 = (obj, result = {}, keyname = []) => {
    if (isObject(obj)) {
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
   * @param {{}} level1object
   */
  const execWatchMethods = (level1object) => {
    for (let key in level1object) {
      if (key in watch) {
        let fn = watch[key]
        fn.length === 1 ? fn(level1object[key][1]) : fn(...level1object[key])
      }
    }
  }

  const isObject = (obj) => typeof obj === 'object' && obj !== null

  /**
   * @type {{ data: {}, set: (data: {}) => void }}
   */
  let observe = {
    data: data,
    get set() {}
  }

  regObserve(data, observe.data)

  // set property 선언
  Object.defineProperty(observe, 'set', {
    enumerable: false,
    configurable: false,
    get() {
      return (cb) => {
        let insert
        if (typeof cb === 'function')
          insert = cb(data)
        else if (isObject(cb))
          insert = cb
        else
          return

        execWatchMethods(object2level1(insert))
      }
    },
  })

  return observe
}

module.exports = {
  Observe
}