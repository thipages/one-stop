import {noop, isFunction} from './utils.js'
import {defaultOptions} from './constants.js'
import create from './one-stop.js'
export default (model, notifyFn, options={}) => {
  const {nOptions, nNotifyFn} = normalizeArguments(notifyFn, options)
  return create (model, nNotifyFn, nOptions)
}
function normalizeArguments(notifyFn, options) {
    const nOptions = Object.assign ( {}, defaultOptions, options )
    return (isFunction(notifyFn))
      ? {nNotifyFn: notifyFn, nOptions}
      : {nNotifyFn: noop, nOptions}
}



