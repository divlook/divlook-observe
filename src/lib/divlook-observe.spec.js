'use stric'

const {
  assert
} = require('chai')

const {
  log
} = require('./console')

const {
  Observe
} = require('./divlook-observe')

const data = {
  name: '차의현',
  age: 29,
  object: {
    a: 1,
    b: 1,
    c: {
      a: 1
    }
  }
}

var result1, result2, result3
const observe = Observe(data, {
  watch: {
    'name' (val) {
      // 인자값이 1개면 변경된 값만 출력.
      result1 = null
      result1 = `안녕하세요. ${val}입니다.`
    },
    'object.a' (oldVal, newVal) {
      // 인자값이 2개일 때 첫번째는 old, 두번째는 new.
      result2 = null
      result2 = `old: ${oldVal}, new: ${newVal}`
    },
    'object.c.a' (val) {
      // 하위 객체를 감시할 때는 key값을 comma로 join해서 사용.
      result3 = null
      result3 = val
    }
  }
})

describe('divlook-observe', () => {
  describe('data 출력', () => {
    it('object', () => {
      assert.ok(observe.data, data)
    })
  })
  describe('Set 사용법 (함수형태)', () => {
    it(`안녕하세요. 차 의현입니다.`, () => {
      observe.set(data => ({
        name: `${data.name.slice(0, 1)} ${data.name.slice(1,3)}`
      }))
      assert.equal(result1, `안녕하세요. 차 의현입니다.`)
    })
  })
  describe('Set 사용법 (객체형태)', () => {
    it(`안녕하세요. 이름입니다.`, () => {
      observe.set({
        name: '이름'
      })
      assert.equal(result1, `안녕하세요. 이름입니다.`)
    })
  })
  describe('주의사항 : 상위 객체에서 하위 객체를 지우면 에러가 발생한다.', () => {
    it(`old: 1, new: a`, () => {
      observe.set({
        object: {
          a: 'a',
          b: 1,
          c: {
            a: 1
          }
        }
      })
      assert.equal(result2, `old: 1, new: a`)
    })
    it(`object.b는 watch에 등록되지 않아 출력되지 않는다.`, () => {
      observe.set({
        object: {
          a: 1,
          b: 'b',
          c: {
            a: 1
          }
        }
      })
      assert.isUndefined(undefined)
    })
    it('c.a', () => {
      observe.set({
        object: {
          a: 1,
          b: 1,
          c: {
            a: 'c.a'
          }
        }
      })
      assert.equal(result3, 'c.a')
    })
  })
})