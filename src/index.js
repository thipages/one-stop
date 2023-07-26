export default function (initialState, notifyChanges) {
  // Sepatate root functions and non functions (model) within the initial state
  const functions = {}
  const model = {}
  for (const [key, value] of Object.entries (initialState)) {
      if (typeof value === 'function') {
        functions[key] = value
      } else {
        model[key] = value
      }
  }
  const notify = notifyChanges ? debounce(notifyChanges) : noop
  const state = structuredClone(model)
  const ro = new Proxy(state, readOnlyProxy())
  const rw = new Proxy(state, trackerProxy(notify))
  const fn = {}
  // Add again the removed functions to set function
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
function debounce(fn, timeout = 300) {
  const start = () => {
    timer = setInterval(()=> {
      if (calls> 1) {
        fn()
        clearInterval(timer)
      }
      calls = 0
    }, timeout)
  }
  let timer, calls = 0
  return () => {
    calls++
    if (timer) return
    start()
    fn()
  }
}