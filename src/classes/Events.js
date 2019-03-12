/* @flow */
/* eslint-disable no-unused-vars */

import { EVENT_DISABLE_KEY, EVENT_ONCE_KEY } from 'lib/enums'
import { defineProperty } from 'lib/utils'

class Events {
  events: Object

  addListener: void

  removeListener: void

  removeAllListeners: void

  constructor() {
    this.events = Object.create(null)
    this.addListener = this.on.bind(this)
    this.removeListener = this.off.bind(this)
    this.removeAllListeners = this.offAll.bind(this)
  }

  initEvent(type: string): boolean {
    if (this.events[type]) {
      return false
    }
    this.events[type] = []
    return true
  }

  disable(type: string) {
    this.setDisable(type, true)
  }

  enable(type: string) {
    this.setDisable(type, false)
  }

  setDisable(type: string, value: boolean) {
    this.initEvent(type)
    defineProperty(this.events[type], EVENT_DISABLE_KEY, value)
  }

  isDisabled(type: string) {
    this.initEvent(type)
    return !!this.events[type][EVENT_DISABLE_KEY]
  }

  on(type: string, listener: void) {
    this.initEvent(type)

    // push listener to list events for this type
    this.events[type].push(listener)
  }

  once(type: string, listener: void) {
    defineProperty(listener, EVENT_ONCE_KEY, true)
    this.on(type, listener)
  }

  off(type: string, listener: void) {
    this.initEvent(type)

    const store = this.events[type]
    const length = store.length >>> 0 // eslint-disable-line no-bitwise
    if (length === 0) return

    for (let i = length; i >= 0; i -= 1) {
      const fn = store[i]
      if (fn === listener) {
        this.events[type].splice(i, 1)
        break
      }
    }
  }

  offAll(types: string[]) {
    // get all event types, filter and create new list events
    const listTypes = Object.keys(this.events)
    const leftTypes = listTypes.filter(type => !types.includes(type))
    const events = Object.create(null)

    // assign new list events
    this.events = leftTypes.reduce((acc, type) => {
      acc[type] = this.events[type]
      return acc
    }, events)
  }

  emit(type: string, ...args: any) {
    // break if not have listeners wait for this type
    if (!this.events[type]) return

    // break if disabled this type
    if (this.isDisabled(type)) return

    // check and call listeners
    this.events[type].forEach((listener, idx) => {
      listener(...args)
      if (EVENT_ONCE_KEY in listener) {
        this.events[type].splice(idx, 1)
      }
    })
  }
}

export default Events
