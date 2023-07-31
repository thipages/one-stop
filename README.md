# one-stop
A simple state manager

## Principle
`one-stop` wraps an object model (which can include root functions) and returns by default an object having a `state` property and all functions declared in the original object.

As Write Mode, `one-stop` accepts three arguments
- `model` object which should declare mutations functions in a dedicated `actions` property
- `notify` function which is called after any changes (in the timeframe of `timeout` option)
- `timeout` number being the maximum time after which `notify` function is called  (optional, default: 50ms)

As Read-Only Mode
- `one-stop` accepts only the `model` as argument
- the `actions` as not acessible
- the state is read-only

## Example (Write Mode)

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
// WRITING (prints "state updated")
state.array.push('two')
increment(1)
// READING (prints true 1 undefined)
console.log(
  isZeroCount(),
  state.count,
  state.foo
)
// CREATING new property throws a TypeError
state.foo = 1

```