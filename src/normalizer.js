import {noop, isFunction} from './utils.js'
import {defaultOptions} from './constants.js'
export {normalizeArguments, normalizeOptions}
function normalizeArguments(notifyFn, options) {
    const nOptions = normalizeOptions(options)
    return (isFunction(notifyFn))
      ? {nNotifyFn: notifyFn, nOptions}
      : {nNotifyFn: noop, nOptions}
}
function normalizeOptions(options) {
    const nOptions = Object.assign ( {}, defaultOptions, options )
    return {
        ... nOptions,
        strictly : nOptions.strictly === 2 ? 2 : 1
    }
}