import {noop, isFunction} from './utils.js'
import oneStop from './one-stop.js'
export default (model, notifyFn, timeout=50) => {
  return isFunction(notifyFn)
    ? oneStop (model, notifyFn, timeout, false)
    : oneStop (model, noop, timeout, true)
}



