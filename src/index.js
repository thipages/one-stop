import {noop, isFunction} from './utils.js'
import {defaultOptions} from './constants.js'
import create from './one-stop.js'
export default (model, notifyFn, options={}) => {
  return create (
    model,
    isFunction(notifyFn) ? notifyFn : noop,
    Object.assign ( {}, defaultOptions, options )
  )
}



