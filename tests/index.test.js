import oneStop from './../src/index.js'
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
    shop.set.array.push(4)
    expect(shop.get.array.length).toBe(4)
  })
 })