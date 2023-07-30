import { jest } from '@jest/globals';
import oneStop from '../src/index.js'
import model from './model.js'
let shop, readMode, writeMode
beforeEach (
  () => {
    shop = oneStop(model)
  }
)
describe("full mode tests", () => {
  it('should update a non-nested primitive via state', () => {
    const {state} = shop
    state.count = 1
    expect(state.count).toBe(1)
  })
  it('should update via fn', () => {
    const {state, increment} = shop
    increment(1)
    expect(state.count).toBe(1)
  })
  it('should update a nested primitive', () => {
    const {state} = shop
    state.nest.count = 1
    expect(state.nest.count).toBe(1)
    expect(state.nest.count).toBe(1)
  })
  it('should call a notification after updating an array', (done) => {
    shop = oneStop(model, done)
    const {state} = shop
    state.array.push(4)
    expect(state.array.length).toBe(4)
  })
  it('should update an array', () => {
    const {state} = shop
    state.array.push(4)
    expect(state.array.length).toBe(4)
  })
  it('reads via a fn', () => {
    const {isZeroCount} = shop
    expect(isZeroCount()).toBe(true)
  })
  it('prevents new property creation/assignments', () => {
    expect.assertions(1)
    const {state} = shop
    try {
      state.foo = 1
    } catch (error) {
      expect(error.name).toBe('ReferenceError')
    }
  })
  it('prevents new nnested property creation/assignments', () => {
    expect.assertions(1)
    const {state} = shop
    try {
      state.nest.foo = 1
    } catch (error) {
      expect(error.name).toBe('ReferenceError')
    }
  })
  it('should return undefined while getting an unknown property', () => {
    const {state} = shop
    expect(state.foo).toBe(undefined)
  })
  it('should receive one nofification after an array push', () => {
    const mock = jest.fn();
    shop = oneStop(model, mock)
    const {state} = shop
    jest.useFakeTimers();
    state.array.push(4)
    jest.runAllTimers();
    expect(mock).toHaveBeenCalledTimes(1);
  })
  it('should receive two nofifications after an array push', () => {
    const mock = jest.fn();
    shop = oneStop(model, mock, {timeout: 0})
    const {state} = shop
    jest.useFakeTimers();
    state.array.push(4)
    jest.runAllTimers();
    expect(mock).toHaveBeenCalledTimes(2);
  })
 })