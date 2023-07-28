const defaultOptions = {
  timeout : 50
}
export function oneShop (models, notifyChanges, options = {}) {
  const notify = typeof notifyChanges === 'function'
    ? postpone (notifyChanges, options.timeout || defaultOptions.timeout)
    : null
  const o = Object.assign({timeout:0}, options)
  const updatedModels = {}
  for (const [key, model] of Object.entries(models)) {
    updatedModels[key] = oneStop(model, notify, o)
  }
  return updatedModels
}
export default function oneStop (initialModel, notifyChanges, options = {}) {
  const o = Object.assign ( {}, defaultOptions, options)
  const functions = {}
  const model = {}
  // Extract root functions from model
  for (const [key, value] of Object.entries (initialModel)) {
      if (typeof value === 'function') {
        functions[key] = value
      } else {
        model[key] = value
      }
  }
  const notify = typeof notifyChanges !== 'function'
    ? noop
    : o.timeout === 0
        ? notifyChanges
        : postpone(notifyChanges, o.timeout)
  const state = structuredClone(model)
  const ro = new Proxy(state, readOnlyProxy())
  const rw = new Proxy(state, trackerProxy(notify))
  const fn = {}
  // add root functions in fn
  for (const [key, value] of Object.entries (functions)) {
    fn[key] = function () {
        return value.apply(state, arguments) 
    }
  }
  return { ro, rw, fn }
}
function readOnlyProxy () {
  return {
    get(target, key) {
      return typeof target[key] === 'object' && target[key] !== null
        ? new Proxy(target[key], readOnlyProxy())
        : Reflect.get(target,key)
    },
    set () {
      return false
    },
    deleteProperty () {
      return false;
    }
  }
}
function trackerProxy (notifyChanges) {
  return {
    get(target, key) {
      return typeof target[key] === 'object' && target[key] !== null
        ? new Proxy(target[key], trackerProxy(notifyChanges))
        : Reflect.get(target,key)
    },
    set (target, key, value, receiver) {
      throwIfReferenceError(target, key)
      Reflect.set(target, key, value, receiver)
      notifyChanges()
      return true
    },
    deleteProperty: function() {
      return false
    }
  }
}
function noop () {}
function throwIfReferenceError(target, key) {
  // https://stackoverflow.com/questions/39880064/proxy-index-gets-converted-to-string
  if (Array.isArray(target) && (key === 'length' || /\d+/.test(key))) return 
  if (!target.hasOwnProperty(key)) {
    throw new ReferenceError('Unknown property: '+key);
  }
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