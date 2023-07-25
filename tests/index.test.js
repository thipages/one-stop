import oneStop from './../src/index.js'
import {jest} from '@jest/globals'
const initialState = {
  count:0,
  array : [1, 2, 3],
  nest : {
    count:0
  },
  increment (inc) {
    this.count += inc
  },
  isZeroCount() {
    return this.count === 0
  }
}
const mockCallback = jest.fn(x => true);
let shop
beforeEach (
  () => {
    shop = oneStop(initialState)
  }
)
describe("Basics operations", () => {
  it('should update a non-nested primitive', () => {
    
    const {get, fn} = shop
    fn.increment(2)
    expect(get.count).toBe(2)

  })
  it('should update an array', () => {
    const {get, set, subscribe} = shop
    subscribe(mockCallback)
    set.array.push(4)
    expect(get.array.length).toBe(4)
    // Two calls should occur : insertion + length property changes
    expect(mockCallback.mock.calls).toHaveLength(2)
  })
  it('can use fn for calling getters', () => {
    const {fn} = shop
    const isZero = fn.isZeroCount()
    expect(isZero).toBe(true)
  })
 })