export default function (initialState) {
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
  const subs = new Set
  const subscribe = callback => {
    subs.add(callback)
    return () => subs.delete(callback)
  }
  const state = structuredClone(model)
  const ro = new Proxy(state, readOnlyProxy())
  const rw = new Proxy(state, trackerProxy(subs))
  const fn = {}
  // Add again the removed functions to set function
  for (const [key, value] of Object.entries (functions)) {
    fn[key] = function () {
        return value.apply(state, arguments) 
    }
  }
  return { ro, rw, fn, subscribe}
}
function readOnlyProxy () {
  return {
    get(target, key) {
      return typeof target[key] === 'object' && target[key] !== null
        ? new Proxy(target[key], readOnlyProxy())
        : Reflect.get(target,key)
    },
    set : function () {
      return false
    },
    deleteProperty: function() {
      return false;
    }
  }
}
function trackerProxy (subscriptions) {
  return {
    get(target, key) {
      return typeof target[key] === 'object' && target[key] !== null
        ? new Proxy(target[key], trackerProxy(subscriptions))
        : Reflect.get(target,key)
    },
    set : function (target, key, value, receiver) {
      throwIfReferenceError(target, key)
      Reflect.set(target, key, value, receiver)
      for (const sub of Array.from(subscriptions)) {
        sub()
      }
      return true
    },
    deleteProperty: function() {
      return false
    }
  }
}
function throwIfReferenceError(target, key) {
  // https://stackoverflow.com/questions/39880064/proxy-index-gets-converted-to-string
  if (Array.isArray(target) && (key === 'length' || /\d+/.test(key))) return 
  if (!target.hasOwnProperty(key)) {
    throw new ReferenceError('Unknown property: '+key);
  }
}