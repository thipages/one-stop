import {noop, isFunction} from './utils.js'
import {defaultOptions} from './constants.js'
export {normalizeArguments, normalizeOptions}
function normalizeArguments(notifyChanges, options) {
    const nOptions = normalizeOptions(options)
    return (isFunction(notifyChanges))
      ? {notify: notifyChanges, options: nOptions}
      : {notify: noop, options: nOptions}
  }
  function normalizeOptions(options) {
    const nOptions = Object.assign ( {}, defaultOptions, options )
    return {
      ... nOptions,
      strictly : nOptions.strictly === 2 ? 2 : 1
    }
  }