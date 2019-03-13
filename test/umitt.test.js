/* eslint-disable no-undef */

import Events from 'classes/Events'

const random = () => Math.random()
  .toString(36)
  .slice(2)

const range = length => Array.from(Array(length).keys())

const getLength = arr => (Array.isArray(arr) ? arr.filter(Boolean).length : 0)

describe('Instances', () => {
  test('Instances have properties', () => {
    const emitter = new Events()
    const PROPERTIES = [
      'disable',
      'enable',
      'setDisable',
      'isDisabled',
      'on',
      'once',
      'off',
      'offAll',
      'emit',
      'addListener',
      'removeListener',
      'removeAllListeners',
    ]

    PROPERTIES.forEach((property) => {
      expect(emitter).toHaveProperty(property)
    })
  })

  test('Instances have store', () => {
    const emitter = new Events()
    const PROPERTIES = ['events']

    PROPERTIES.forEach((property) => {
      expect(emitter).toHaveProperty(property)
    })
  })
})

describe('Workflow', () => {
  test('Use `on` function', () => {
    const length = 10
    const type = random()
    const values = range(length).map(() => random())
    const emitter = new Events()

    let result
    expect(result).toBeUndefined()

    const callback = (idx) => {
      result = values[idx]
    }
    emitter.on(type, callback)
    expect(getLength(emitter.events[type])).toEqual(1)

    values.forEach((value, idx) => {
      emitter.emit(type, idx)
      expect(result).toEqual(value)
    })

    expect(getLength(emitter.events[type])).toEqual(1)
  })

  test('Use `once` function', () => {
    const length = 10
    const type = random()
    const values = range(length).map(() => 1)
    const emitter = new Events()

    let called = 0
    expect(called).toEqual(0)

    const callback = () => {
      called += 1
    }
    emitter.once(type, callback)
    expect(getLength(emitter.events[type])).toEqual(1)

    values.forEach((value) => {
      emitter.emit(type)
      expect(called).toEqual(value)
    })

    expect(getLength(emitter.events[type])).toEqual(0)
  })

  test('Use `off` basic function', () => {
    const type = random()
    const values = [1, 2, 3, 3, 3]
    const indexToOff = 3
    const emitter = new Events()

    let called = 0
    expect(called).toEqual(0)

    const callback = () => {
      called += 1
    }
    emitter.on(type, callback)
    expect(getLength(emitter.events[type])).toEqual(1)

    values.forEach((value, idx) => {
      if (idx === indexToOff) {
        emitter.off(type, callback)
        expect(getLength(emitter.events[type])).toEqual(0)
      }
      emitter.emit(type)
      expect(called).toEqual(value)
    })
  })

  test('Use `offAll` function', () => {
    const type1 = random()
    const type2 = random()
    const emitter = new Events()

    let result
    expect(result).toBeUndefined()

    const callback = (value) => {
      result = value
    }

    emitter.on(type1, callback)
    emitter.on(type2, callback)

    expect(getLength(emitter.events[type1])).toEqual(1)
    expect(getLength(emitter.events[type2])).toEqual(1)

    emitter.emit(type1, type1)
    expect(result).toEqual(type1)

    emitter.emit(type2, type2)
    expect(result).toEqual(type2)

    emitter.offAll([type1])

    emitter.emit(type1, type1)
    expect(result).toEqual(type2)

    emitter.emit(type2, type1)
    expect(result).toEqual(type1)

    expect(getLength(emitter.events[type1])).toEqual(0)
    expect(getLength(emitter.events[type2])).toEqual(1)
  })

  test('Use `disable` and `enable` function', () => {
    const type = random()
    const emitter = new Events()

    let called = 0
    expect(called).toEqual(0)

    const callback = () => {
      called += 1
    }
    emitter.on(type, callback)
    expect(getLength(emitter.events[type])).toEqual(1)

    emitter.emit(type)
    expect(called).toEqual(1)

    emitter.emit(type)
    expect(called).toEqual(2)

    emitter.disable(type)
    expect(getLength(emitter.events[type])).toEqual(1)

    emitter.emit(type)
    expect(called).toEqual(2)

    emitter.enable(type)

    emitter.emit(type)
    expect(called).toEqual(3)
  })

  test('Use `eventNames` function', () => {
    const type1 = random()
    const type2 = random()
    const emitter = new Events()

    let called = 0
    expect(called).toEqual(0)

    const callback = () => {
      called += 1
    }
    emitter.on(type1, callback)
    emitter.on(type2, callback)

    const eventNames = emitter.eventNames()
    const isHaveNames = [type1, type2].every(type => eventNames.includes(type))

    expect(isHaveNames).toEqual(true)
    expect(eventNames.length).toEqual(2)
  })

  test('Use `listeners` function', () => {
    const type1 = random()
    const type2 = random()
    const emitter = new Events()

    const callback1 = () => {}
    emitter.on(type1, callback1)

    const callback2 = () => {}
    emitter.on(type2, callback2)

    const listeners1 = emitter.listeners(type1)
    const isEqualListeners1 = listeners1.every(
      listener => listener === callback1,
    )
    expect(isEqualListeners1).toEqual(true)
    expect(listeners1.length).toEqual(1)

    const listeners2 = emitter.listeners(type2)
    const isEqualListeners2 = listeners2.every(
      listener => listener === callback2,
    )
    expect(isEqualListeners2).toEqual(true)
    expect(listeners2.length).toEqual(1)
  })

  test('Advanced usage', () => {
    const type = random()
    const emitter = new Events()

    let called = 0
    expect(called).toEqual(0)

    const callback = () => {
      called += 1
    }
    emitter.on(type, callback)
    emitter.on(type, callback)
    emitter.on(type, callback)
    expect(getLength(emitter.events[type])).toEqual(3)

    emitter.emit(type)
    expect(called).toEqual(3)

    emitter.off(type, callback)
    expect(getLength(emitter.events[type])).toEqual(2)

    emitter.off(type, callback)
    expect(getLength(emitter.events[type])).toEqual(1)

    emitter.off(type, callback)
    expect(getLength(emitter.events[type])).toEqual(0)

    emitter.on(type, callback)
    expect(getLength(emitter.events[type])).toEqual(1)
  })
})
