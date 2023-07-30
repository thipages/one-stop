import  {RM, WM} from './constants.js'
import notifier from './notifier.js'
import { readOnlyProxy, trackerProxy } from './proxy-handlers.js'
import { isFunction } from './utils.js'
export default (model, notifyFn, options) => {
    const {ro, rw, roFns, rwFns} = getPrimitives(model, notifyFn, options)
    return options.readOnly
      ? { state: ro, ...roFns }
      : {state : rw, ...roFns, ...rwFns}
  }
  function getPrimitives (initialModel, notifyFn, options) {
    const {state, computed, actions} = getModelParts(initialModel)
    const notify = notifier (notifyFn, options.timeout)
    //
    const ro = new Proxy(state, readOnlyProxy())
    const rw = new Proxy(state, trackerProxy(notify))
    const roFns = createContextualFns(computed, rw)
    const rwFns = createContextualFns(actions, rw)
    return {ro, rw, roFns, rwFns}
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
  function createContextualFns (fnObj, context) {
    const res = {}
    for (const [key, fn] of Object.entries (fnObj)) {
      res[key] = function () {
          return fn.apply(context, arguments) 
      }
    }
    return res
  }