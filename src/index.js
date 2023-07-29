const defaultOptions = {
  timeout : 50,
  strictly: 1 // 1 or 2 allowed
}
const RM = 'readMode'
const WM = 'writeMode'
const isFunction = (f) => typeof f === 'function'
//
export default (model, notifyChanges, options={}) => {
  const {options: opts, notify} = normalizeArguments(notifyChanges, options)
  return api (model, notify, opts)
}
export function oneShop (models, notifyChanges, options = {}) {
  const {options: nOptions, notify} = normalizeArguments(notifyChanges, options)
  const m = {
    [RM] : {},
    [WM] : {}
  }
  const notif = notifier(notify, nOptions.timeout)
  // each one-stop gives low level info to OneShop
  nOptions.timeout=0
  for (const [key, model] of Object.entries(models)) {
    const modelApi = api(model, notif, nOptions)
    for(const v of [RM, WM]) {
      m[v][key] = modelApi[v]
    }
  }
  return m
}
function api(model, notifyChanges, options) {
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
function normalizeArguments(notifyChanges, options) {
  const nOptions = normalizeOptions(options)
  return (isFunction(notifyChanges))
    ? {notify: notifyChanges, options: nOptions}
    : {notify: noop, options: nOptions}
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
function notifier (notifyChanges, timeout) {
  const n = typeof notifyChanges !== 'function'
  ? noop
  : timeout === 0
      ? notifyChanges
      : postpone(notifyChanges, timeout)
  return n
}
function toModelParts(model) {
  const computed = {}
  const state = {}
  let actions = {}
  for (const [key, value] of Object.entries (model)) {
      if (key === 'actions') {
         actions = value
      } else if (typeof value === 'function') {
        computed[key] = value
      } else {
        state[key] = value
      }
  }
  return {state: structuredClone(state), computed, actions}
}
function normalizeOptions(options) {
  const nOptions = Object.assign ( {}, defaultOptions, options )
  return {
    ... nOptions,
    strictly : nOptions.strictly === 2 ? 2 : 1
  }
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
function trackerProxy (notify) {
  return {
    get(target, key) {
      return typeof target[key] === 'object' && target[key] !== null
        ? new Proxy(target[key], trackerProxy(notify))
        : Reflect.get(target,key)
    },
    set (target, key, value, receiver) {
      throwIfReferenceError(target, key)
      const set = Reflect.set(target, key, value, receiver)
      if (set) notify()
      return set
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