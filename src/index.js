import {noop, isFunction} from './utils.js'
import {defaultOptions} from './constants.js'
import create from './one-stop.js'
export default (model, notifyFn, timeout=50) => {
  return isFunction(notifyFn)
    ? create (model, notifyFn, timeout)
    : create (model, noop, -1)
}



