# README

Getter/Setter를 이용하여 객체의 변화를 감지하는 라이브러리입니다.

- observe를 생성한 뒤 동적으로 추가한 객체는 적용되지 않습니다.
- Array는 감지하지 못합니다.

## Script

```bash
# 설치
npm i
# 실행
npm run start
# 테스트
npm run test
```

## Example

```js
var { Observe } = require('./lib/divlook-observe')

var data = {
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

var observe = Observe(data, {
  watch: {
    'name' (val) {
      // 인자값이 1개면 변경된 값만 출력.
      console.log(`안녕하세요. ${val}입니다.`)
    },
    'object.a' (oldVal, newVal) {
      // 인자값이 2개일 때 첫번째는 old, 두번째는 new.
      console.log('old', oldVal, 'new', newVal)
    },
    'object.c.a' (a) {
      // keypath
      // 하위 객체를 감시할 때는 key값을 comma로 join해서 사용.
      console.log(a)
    }
  }
})
```

## Guide

- Types

  # Parameter

  | Name    | Type   | Default  | description       |
  |:-------:|:------:|:--------:|:------------------|
  | data    | Object | required | Object to observe |
  | options | Object |          | Option            |

  ```ts
  Observe(data: Object[, options: Object = {}])
  ```

  # Options

  | Name  | Type   | Default  | description       |
  |:-----:|:------:|:--------:|:------------------|
  | watch | Object | {}       | Object to observe |

  ```ts
  var options = {
    watch: {
      keyName(value) {
        // observe.data.keyName = 'Hello world'
        // value == 'Hello world'
      },
      oldAndNew(oldVal, newVal) {
        // observe.data.oldAndNew == 'old'
        // observe.data.oldAndNew = 'new'
        // oldVal == 'old'
        // newVal == 'new'
      },
      'key.path.one.two'(value) {
        // observe.data.key.path.one.two = 'Hello world'
        // value == 'Hello world'
      },
    }
  }
  ```

- Methods

  # observe.set(Object | (data) => data)

  한번에 여러 데이터를 변경할 때 좋음

  ```js
  // 객체형식
  observe.set({
    name: '다른이름',
    age: 999,
  })

  // 콜백형식
  observe.set(preData => {
    return {
      name: '새로운 ' + preData.name,
      age: preData.age - 970,
    }
  })
  ```