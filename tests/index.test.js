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
  }
}
const mockCallback = jest.fn(x => true);
let shop
beforeEach(() => {
  shop = oneStop(initialState)
  
});
describe("Check set/get", () => {
  it('should update a non-nested primitive', () => {
    shop.set.increment(2)
    expect(shop.get.count).toBe(2)

  })
  it('should update an array', () => {
    shop.subscribe(mockCallback)
    shop.set.array.push(4)
    expect(shop.get.array.length).toBe(4)
    expect(mockCallback.mock.calls).toHaveLength(2);
  })
 })