import { jest } from '@jest/globals';
import oneStop from '../src/index.js'
const model = {
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
let shop
beforeEach (
  () => {
    shop = oneStop(model)
  }
)
describe("one-stop tests", () => {
  it('should update a non-nested primitive via rw', () => {
    const {ro, rw} = shop
    rw.count = 1
    expect(rw.count).toBe(1)
    expect(ro.count).toBe(1)
  })
  it('should update a nested primitive via rw', () => {
    const {ro, rw} = shop
    rw.nest.count = 1
    expect(rw.nest.count).toBe(1)
    expect(ro.nest.count).toBe(1)
  })
  it('sshould update a primitive via fn', () => {
    const {ro, fn} = shop
    fn.increment(2)
    expect(ro.count).toBe(2)
  })
  it('should update an array via rw', (done) => {
    // override beforeEach in order to manage callback test
    shop = oneStop(model, ()=>{
      done()
    })
    const {rw} = shop
    rw.array.push(4)
    expect(rw.array.length).toBe(4)
  })
  it('reads via a fn getter function', () => {
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
  it('should receive one nofification after an array push', () => {
    const mock = jest.fn();
    shop = oneStop(model, mock)
    const {rw} = shop
    jest.useFakeTimers();
    rw.array.push(4)
    jest.runAllTimers();
    expect(mock).toHaveBeenCalledTimes(1);
  })
  it('should receive two nofifications after an array push', () => {
    const mock = jest.fn();
    shop = oneStop(model, mock, {timeout: 0})
    const {rw} = shop
    jest.useFakeTimers();
    rw.array.push(4)
    jest.runAllTimers();
    expect(mock).toHaveBeenCalledTimes(2);
  })
 })