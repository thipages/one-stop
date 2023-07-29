import {oneShop} from '../../src/index.js'
import { jest } from '@jest/globals';
const models = {
  model1: {
    count: 0,
    array : [1, 2]
  }, 
  model2 : {
    count: 0,
    array : [1, 2]
  }
}
let shop, readMode, writeMode
beforeEach (
  () => {
    shop = oneShop(models)
    readMode = shop.readMode
    writeMode = shop.writeMode
  }
)
describe("one-shop tests", () => {
  it('should update the first model', () => {
    const {model1} = writeMode
    model1.state.count = 1
    expect(model1.state.count).toBe(1)
  })
  it('should update the first model', () => {
    const {model2} = writeMode
    model2.state.count = 1
    expect(model2.state.count).toBe(1)
  })
  // https://jestjs.io/fr/docs/timer-mocks
  it('should receive one nofification after updates done on two models', () => {
    const mock = jest.fn();
    shop = oneShop(models, mock)
    const {model1, model2} = shop.writeMode
    jest.useFakeTimers();
    model1.state.count = 1
    model2.state.count = 2
    jest.runAllTimers();
    expect(mock).toHaveBeenCalledTimes(1);
  })
  it('should receive two nofifications after updates done on two models', () => {
    const mock = jest.fn();
    shop = oneShop(models, mock, {timeout: 0})
    const {model1, model2} = shop.writeMode
    jest.useFakeTimers();
    model1.state.count = 1
    model2.state.count = 2
    jest.runAllTimers();
    expect(mock).toHaveBeenCalledTimes(2)
})
 })