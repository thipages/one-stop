export const readOnlyProxy = () => {
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
export const trackerProxy = (notify) => {
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
function throwIfReferenceError(target, key) {
    // https://stackoverflow.com/questions/39880064/proxy-index-gets-converted-to-string
    if (Array.isArray(target) && (key === 'length' || /\d+/.test(key))) return 
    if (!target.hasOwnProperty(key)) {
        throw new ReferenceError('Unknown property: ' + key);
    }
}