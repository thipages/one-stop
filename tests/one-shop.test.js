import {oneShop} from '../src/index.js'
import { jest } from '@jest/globals';
const models = {
  model1: {
    count: 0
  }, 
  model2 : {
    count: 0
  }
}
let shop, model1, model2
beforeEach (
  () => {
    shop = oneShop(models)
    model1 = shop.model1
    model2 = shop.model2
  }
)
describe("one-shop tests", () => {
  it('should update the first model', () => {
    const {rw} = model1
    rw.count = 1
    expect(rw.count).toBe(1)
  })
  it('should update the first model', () => {
    const {rw} = model2
    rw.count = 1
    expect(rw.count).toBe(1)
  })
  // https://jestjs.io/fr/docs/timer-mocks
  it('should receive one nofification after updates done on two model', () => {
    const mock = jest.fn();
    shop = oneShop(models, mock)
    jest.useFakeTimers();
    shop.model1.rw.count = 1
    shop.model1.rw.count = 2
    jest.runAllTimers();
    expect(mock).toHaveBeenCalledTimes(1);
  })
 })