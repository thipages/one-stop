# one-stop
simple state manager

## Usage

```javascript

const initialState = {
  count:0,
  array : ['one'],
  increment (increment) {
    this.count += increment
  }
}
const {get, set, subscribe} = oneStop(initialState)
subscribe(() => console.log('state updated'))
set.increment() // triggers the subscription
set.array.push('two') // triggers the subscription
console.log(get.count) // prints 1

```