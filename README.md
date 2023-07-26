# one-stop
A simple state manager

## Principle
`one-stop` wraps an object (which can include root functions) and returns a `{ro, rw, fn}` object
- `ro` read-only model property allows to read (nested) properties
- `rw` read or write property allows to update or read (nested) object properties
- `fn` function to execute root functions returning or not a value

`one-stop` accepts two arguments
- the wrapped object
- a callback function which notify any changes (debounced at 300ms interval)

## Why having both ro and rw functions ?
`rw` should be enough ...

Part of an application using `one-stop` may want to expose only read-only state (e.g. a web view)

## Example

```javascript
import oneStop from 'one-stop'
const initialState = {
  count:0,
  array : ['one'],
  nest : {
    count : 10
  },
  increment (increment) {
    this.count += increment
  },
  isZeroCount() {
    return this.count === 0
  }
}
const notifyChanges = () => console.log('state updated')
const {ro, rw, fn} = oneStop(initialState, notifyChanges)
// update model from 'rw' or 'fn' functions
rw.array.push('two') // prints "state updated"
fn.increment(1) // prints "state updated"
// returns model properties or computed values from 'ro' or 'fn' functions
console.log(fn.isZeroCount()) // prints "true"
console.log(ro.count) // prints "1"
console.log(rw.count) // prints "1" (same as above)
console.log(ro.nest.count) // prints "10"
console.log(ro.foo) // prints "undefined"
// throws a TypeError (cannot update the readonly model)
ro.count = 1
ro.nest.count = 1
// throws a TypeError (cannot create a new property)
rw.foo = 1
rw.nest.foo = 1

```