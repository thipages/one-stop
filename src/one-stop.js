import  {RM, WM} from './constants.js'
import notifier from './notifier.js'
import { readOnlyProxy, trackerProxy } from './proxy-handlers.js'
import { isFunction } from './utils.js'
export default (model, notifyChanges, options) => {
    const {options: nOptions, ro, rw, roFns, rwFns}
      = getPrimitives(model, notifyChanges, options)
    return {
      [RM] : {
        state: ro,
        ... roFns
      },
      [WM] : {
        state: nOptions.strict ? ro : rw,
        ...roFns,
        ...rwFns
      }
    }
  }
  function getPrimitives (initialModel, notifyChanges, options) {
    const {state, computed, actions} = getModelParts(initialModel)
    const notify = notifier (notifyChanges, options.timeout)
    //
    const ro = new Proxy(state, readOnlyProxy())
    const rw = new Proxy(state, trackerProxy(notify))
    const roFns = applyContext(computed, rw)
    const rwFns = applyContext(actions, rw)
    return {options, ro, rw, roFns, rwFns}
  }
  function getModelParts(model) {
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
  function applyContext (fnObj, context) {
    const res = {}
    for (const [key, fn] of Object.entries (fnObj)) {
      res[key] = function () {
          return fn.apply(context, arguments) 
      }
    }
    return res
  }