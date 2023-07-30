import {noop, isFunction} from './utils.js'

export default function (notifyChanges, timeout) {
    const n = !isFunction(notifyChanges)
    ? noop
    : timeout === 0
        ? notifyChanges
        : postpone(notifyChanges, timeout)
    return n
  }
  function postpone(fn, timeout) {
    let timer
    return () => {
      if (timer) return
      timer = setTimeout (
        () => {
          clearTimeout(timer)
          fn()
        }, timeout
      )
    }
  }