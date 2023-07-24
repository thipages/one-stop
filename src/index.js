export default function (initialState) {
  // retrieve functions from the initial state
  const functions = {}
  for (const [key, value] of Object.entries (initialState)) {
      if (typeof value === 'function') {
        functions[key] = value
        delete initialState[key]
      }
  }
  const subs = new Set
  const subscribe = callback => {
    subs.add(callback)
    return () => subs.delete(callback)
  }
  const state = structuredClone(initialState)
  const get = new Proxy(state, readOnlyProxy())
  const set = new Proxy(state, trackerProxy(subs))
  const fn = {}
  // Add again the removed functions to set function
  for (const [key, value] of Object.entries (functions)) {
    fn[key] = function () {
        return value.apply(state, arguments) 
    }
  }
  return { get, set, fn, subscribe}
}
function readOnlyProxy () {
  return {
    get(target, key) {
      return typeof target[key] === 'object' && target[key] !== null
        ? new Proxy(target[key], readOnlyProxy())
        : target[key]
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
        : target[key]
    },
    set : function (target, key, value) {
      target[key]=value
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