# one-stop
A simple state manager

## Principle
`one-stop` wraps an object (which can include root functions) and returns a `{get, set, subscribe}` object
- `get` function allows to retrieve (nested) object properties in read-only mode
- `set` function allows to update object properties
- `subscribe` function triggers a callback (its argument) for each `set` operation

## Example

```javascript
import oneStop from 'one-stop'
const initialState = {
  count:0,
  array : ['one'],
  increment (increment) {
    this.count += increment
  }
}
const {get, set, subscribe} = oneStop(initialState)
subscribe(() => console.log('state updated'))
set.increment(1) // triggers the subscription
set.array.push('two') // triggers the subscription
console.log(get.count) // prints 1

```

## Limitations
- functions can only be declared at the root of the wrapped object
- `subscribe` gives no information about what has been changed
  - it only gives you the information that something changed
- `subscribe` will trigger as many times as `set` function is called
  - pushing a value to an array will trigger two callbacks (insertion + length property changes)
  - sorting an array will trigger many callbacks

This latter limitation can be a performance issue, also a `debounce` function implementation may be useful