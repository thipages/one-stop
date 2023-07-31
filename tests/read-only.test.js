import { jest } from '@jest/globals';
import oneStop from '../src/index.js'
import model from './model.js'
let shop
beforeEach (
  () => {
    shop = oneStop(model) // signature for read-only
  }
)
describe('readonly mode tests', () => {
    it ('should read the state', () => {
        const {state} = shop
        expect(state.count).toBe(0)
    })
    it ('should not update the state', () => {
        const {state} = shop
        expect.assertions(1)
        try {
          state.count = 1
        } catch (error) {
          expect(error.name).toBe('TypeError')
        }
    })
    it ('should not update the state through functions', () => {
        const {increment} = shop
        expect(increment).toBeUndefined()
    })
    it ('should read the state through functions', () => {
        const {isZeroCount} = shop
        expect(isZeroCount()).toBe(true)
    })
})