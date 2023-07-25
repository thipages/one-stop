# one-stop
A simple state manager

## Principle
`one-stop` wraps an object (which can include root functions) and returns a `{ro, rw, fn ,subscribe}` object
- `ro` read-only model function allows to read (nested) object properties
- `rw` read or write model function allows to update or read (nested) object properties
- `fn` function to execute root functions returning or not a value
- `subscribe` function triggers a callback (its argument) for each `rw` operation (see limitations)

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
const {ro, rw, fn, subscribe} = oneStop(initialState)
subscribe(() => console.log('state updated'))
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

## Limitations
- functions can only be declared at the root of the wrapped object
- `subscribe` gives no information about what has been changed
  - it only gives you the information that something changed
- `subscribe` will trigger as many times as `rw` function is called
  - pushing a value to an array will trigger two callbacks (insertion + length property changes)
  - sorting an array will trigger many callbacks

This latter limitation can lead to performance issues; Also a `debounce` function implementation may be useful to avoid multiple sequential calls treatment for one `rw` operation.