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
    shop = oneStop(initialState, mockCallback)
  }
)
describe("One bag tests", () => {
  it('should update a non-nested primitive', () => {
    const {rw, fn} = shop
    fn.increment(2)
    expect(rw.count).toBe(2)
  })
  it('should update an array', () => {
    const {rw} = shop
    rw.array.push(4)
    expect(rw.array.length).toBe(4)
    // Two calls should occur : insertion + length property, but debounced, so 1
    expect(mockCallback.mock.calls).toHaveLength(1)
  }, 300)
  it('can use fn for calling getters', () => {
    const {fn} = shop
    const isZero = fn.isZeroCount()
    expect(isZero).toBe(true)
  })
  it('throws an error if one try to update the readonly model (get function)', () => {
    expect.assertions(1)
    const {ro} = shop
    try {
      ro.count = 1
    } catch (error) {
      expect(error.name).toBe('TypeError')
    }
  })
  it('prevents new property creation/assignments', () => {
    expect.assertions(1)
    const {rw} = shop
    try {
      rw.foo = 1
    } catch (error) {
      expect(error.name).toBe('ReferenceError')
    }
  })
  it('prevents new nnested property creation/assignments', () => {
    expect.assertions(1)
    const {rw} = shop
    try {
      rw.nest.foo = 1
    } catch (error) {
      expect(error.name).toBe('ReferenceError')
    }
  })
  it('should return undefined while getting an unknown property', () => {
    const {ro} = shop
    expect(ro.foo).toBe(undefined)
  })
 })