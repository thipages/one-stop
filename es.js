const noop = () => {};
const isFunction = (f) => typeof f === 'function';

function notifier (notifyFn, timeout) {
    return timeout === 0
        ? notifyFn
        : postpone(notifyFn, timeout)
}
function postpone(fn, timeout) {
    let timer;
    return () => {
        if (timer) return
        timer = setTimeout (
        () => {
            clearTimeout(timer);
            fn();
        }, timeout
        );
    }
}

const readOnlyProxy = () => {
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
  };
const trackerProxy = (notify) => {
    return {
      get(target, key) {
        return typeof target[key] === 'object' && target[key] !== null
          ? new Proxy(target[key], trackerProxy(notify))
          : Reflect.get(target,key)
      },
      set (target, key, value, receiver) {
        throwIfReferenceError(target, key);
        const set = Reflect.set(target, key, value, receiver);
        if (set) notify();
        return set
      },
      deleteProperty: function() {
        return false
      }
    }
};
function throwIfReferenceError(target, key) {
    // https://stackoverflow.com/questions/39880064/proxy-index-gets-converted-to-string
    if (Array.isArray(target) && (key === 'length' || /\d+/.test(key))) return 
    if (!target.hasOwnProperty(key)) {
        throw new ReferenceError('Unknown property: ' + key);
    }
}

var oneStop = (model, notifyFn, timeout, isReadOnly) => {
  const notify = isReadOnly
    ? noop
    : notifier (notifyFn, timeout);
  const {ro, rw, roFns, rwFns} = getPrimitives(model, notify);
  return isReadOnly
    ? { state: ro, ...roFns }
    : {state : rw, ...roFns, ...rwFns}
};
  function getPrimitives (model, notify) {
    const {state, computed, actions} = getModelParts(model);
    const ro = new Proxy(state, readOnlyProxy());
    const rw = new Proxy(state, trackerProxy(notify));
    const roFns = createContextualFns(computed, rw);
    const rwFns = createContextualFns(actions, rw);
    return {ro, rw, roFns, rwFns}
  }
  function getModelParts(model) {
    const computed = {};
    const state = {};
    let actions = {};
    for (const [key, value] of Object.entries (model)) {
        if (key === 'actions') {
           actions = value;
        } else if (isFunction(value)) {
          computed[key] = value;
        } else {
          state[key] = value;
        }
    }
    return {state: structuredClone(state), computed, actions}
  }
  function createContextualFns (fnObj, context) {
    const res = {};
    for (const [key, fn] of Object.entries (fnObj)) {
      res[key] = function () {
          return fn.apply(context, arguments) 
      };
    }
    return res
  }

var index = (model, notifyFn, timeout=50) => {
  return isFunction(notifyFn)
    ? oneStop (model, notifyFn, timeout, false)
    : oneStop (model, noop, timeout, true)
};

export { index as default };
