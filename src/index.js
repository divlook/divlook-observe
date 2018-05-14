'use stric'

const {
  log
} = require('./lib/console')
const {
  Observe
} = require('./lib/divlook-observe')

const data = {
  name: '차의현',
  age: 29,
  object: {
    a: 1,
    b: 1,
    c: {
      a: 1
    }
  },
}


let observe = Observe(data, {
  watch: {
    'name' (val) {
      // 인자값이 1개면 변경된 값만 출력.
      log(`안녕하세요. ${val}입니다.`)
    },
    'object.a' (oldVal, newVal) {
      // 인자값이 2개일 때 첫번째는 old, 두번째는 new.
      log('old', oldVal, 'new', newVal)
    },
    'object.c.a' (a) {
      // 하위 객체를 감시할 때는 key값을 comma로 join해서 사용.
      log(a)
    }
  }
})

/**
 * data 출력
 */
log.line = observe.data

/**
 * Set 사용법 (함수형태)
 */
observe.set(data => ({
  name: `${data.name.slice(0, 1)} ${data.name.slice(1,3)}`
}))

/**
 * Set 사용법 (객체형태)
 */
observe.set({
  name: '이름'
})

observe.set({
  object: {
    a: 'a',
    b: 'b',
    c: {
      a: 'c.a'
    }
  }
})

/**
 * Getter/Setter 테스트
 */
observe.data.name = '임나연'
observe.data.object.a = 5