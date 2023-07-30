# one-stop
A simple state manager

## Principle
`one-stop` wraps an object model (which can include root functions) and returns by default an object having a `state` property and all functions declared in the original object.

`one-stop` accepts three arguments
- a `model` which should declare mutations functions in a dedicated `actions` property
- a `notify` function which is called after any changes (in the timeframe of `timeout` option)
- a `options` parameter (optional)

## Example (default options)

```javascript
import oneStop from 'one-stop'
const model = {
  count:0,
  array : ['one'],
  nest : {
    count : 10
  },
  isZeroCount() {
    return this.count === 0
  },
  actions { // actions will be flatten to the root object
    increment (increment) {
      this.count += increment
    }
  }
}
const notifyChanges = () => console.log('state updated')
const {state, increment, isZeroCount} = oneStop(initialState, notifyChanges)
// WRITING
state.array.push('two') // prints "state updated"
increment(1) // prints "state updated"
// READING
console.log(
  isZeroCount(), // "true"
  state.count, // 1
  state.count, // 1 (same as above)
  state.nest.count, 10
  state.foo, // undefined
)
// Cannot create a new property (throw a TypeError)
state.foo = 1
state.nest.foo = 1

```

## Options
There are three options
- `timeout`  (number)  : the minimum time after which `notify` function is called  (default 50ms)
- `readOnly` (boolean) : when true, the object is read-only  (default false)
  - `actions` are not accessible
  - `state` is read-only