import  {RM, WM} from './constants.js'
import notifier from './notifier.js'
import {normalizeOptions} from './normalize.js'
import { readOnlyProxy, trackerProxy } from './proxy-handlers.js'
import { isFunction } from './utils.js'
export default (model, notifyChanges, options) => {
    const {nOptions, ro, rw, roFns, rwFns} = theOne(model, notifyChanges, options)
    return {
      [RM] : {
        state: ro,
        ... roFns
      },
      [WM] : {
        state: nOptions.strictly === 2 ? ro : rw,
        ...roFns,
        ...rwFns
      }
    }
  }

  function theOne (initialModel, notifyChanges, options) {
    const {state, computed, actions} = toModelParts(initialModel)
    const nOptions = normalizeOptions(options)
    const notify = notifier (notifyChanges, nOptions.timeout)
    //
    const ro = new Proxy(state, readOnlyProxy())
    const rw = new Proxy(state, trackerProxy(notify))
    const roFns = applyToMany(computed, rw)
    const rwFns = applyToMany(actions, rw)
    return {nOptions, ro, rw, roFns, rwFns}
  }
  function toModelParts(model) {
    const computed = {}
    const state = {}
    let actions = {}
    for (const [key, value] of Object.entries (model)) {
        if (key === 'actions') {
           actions = value
        } else if (isFunction(value)) {
          computed[key] = value
        } else {
          state[key] = value
        }
    }
    return {state: structuredClone(state), computed, actions}
  }
  function applyToMany (fnObj, context) {
    const res = {}
    for (const [key, fn] of Object.entries (fnObj)) {
      res[key] = function () {
          return fn.apply(context, arguments) 
      }
    }
    return res
  }