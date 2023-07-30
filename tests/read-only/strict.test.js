import { jest } from '@jest/globals';
import oneStop from '../../src/index.js'
import model from '../model.js'
const noop = () => {}
let shop, readMode, writeMode
beforeEach (
  () => {
    shop = oneStop(model, noop, {readOnly: true, strict: true})
  }
)
describe('readonly + strict tests', () => {
    it ('should not read the state', () => {
        const {state} = shop
        expect(state).toBeUndefined()
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