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
    it('observe.data == data', () => {
      assert.ok(observe.data, data)
    })
  })
  describe('Getter/Setter', () => {
    describe('Getter', () => {
      it(`observe.data.name == '차의현'`, () => {
        assert.equal(observe.data.name, '차의현')
      })
      it('observe.data.object.a == 1', () => {
        assert.equal(observe.data.object.a, 1)
      })
    })
    describe('Setter', () => {
      it(`observe.data.name = '임나연'`)
      it('안녕하세요. 임나연입니다.', () => {
        observe.data.name = '임나연'
        assert.equal(result1, '안녕하세요. 임나연입니다.')
      })
      it('observe.data.object.a = 5')
      it('old: 1, new: 5', () => {
        observe.data.object.a = 5
        assert.equal(result2, 'old: 1, new: 5')
      })
    })
  })
  describe('observe.set(object | (data) => void)', () => {
    describe('함수형태', () => {
      it('observe.set(data => ({ name: `${data.name.slice(0, 1)} ${data.name.slice(1, 3)}` }))')
      it(`안녕하세요. 임 나연입니다.`, () => {
        observe.set(data => ({
          name: `${data.name.slice(0, 1)} ${data.name.slice(1,3)}`
        }))
        assert.equal(result1, `안녕하세요. 임 나연입니다.`)
      })
    })
    describe('객체 형태', () => {
      it('observe.set({ name: `이름` })')
      it(`안녕하세요. 이름입니다.`, () => {
        observe.set({
          name: '이름'
        })
        assert.equal(result1, `안녕하세요. 이름입니다.`)
      })
    })
    describe('다중 object', () => {
      it(`observe.set({ object: { a: 'a', b: 1, c: { a: 1 } } })`)
      it(`old: 5, new: a`, () => {
        observe.set({
          object: {
            a: 'a',
            b: 1,
            c: {
              a: 1
            }
          }
        })
        assert.equal(result2, `old: 5, new: a`)
      })
      it(`observe.set({ object: { a: 1, b: 'b', c: { a: 1 } } })`)
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
      it(`observe.set({ object: { a: 1, b: 1, c: { a: 'c.a' } } })`)
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
      describe('주의사항', () => {
        it('다중 object일 때는 observer.set보다 setter를 사용하는게 좋다.')
        it('아래의 경우 object.a와 object.b를 삭제하게 되어 에러가 발생한다.')
        it('observer.set({ object: { c: { a: 2} } })')
      })
    })
  })
})