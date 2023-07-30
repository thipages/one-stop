import { jest } from '@jest/globals';
import oneStop from '../src/index.js'
import model from './model.js'
let shop, readMode, writeMode
beforeEach (
  () => {
    shop = oneStop(model, null, {strict: true})
    readMode = shop.readMode
    writeMode = shop.writeMode
  }
)
describe("one-stop tests", () => {
    it('should not update a non-nested primitive via state', () => {
        const {state} = writeMode
        try {
            state.count = 1
        } catch (error) {
            expect(error.name).toBe('TypeError')
        }
    })
    it('should update in writeMode via fn', () => {
        const {state, increment} = writeMode
        increment(1)
        expect(state.count).toBe(1)
    })
    it('should read in readMode va fn', () => {
        const {isZeroCount} = readMode
        expect(isZeroCount()).toBe(true)
    })
    it('throws an error if one try to update the readonly model (get function)', () => {
        expect.assertions(1)
        const {state} = readMode
        try {
        state.count = 1
        } catch (error) {
        expect(error.name).toBe('TypeError')
        }
    })
    it('prevents new property creation/assignments', () => {
        expect.assertions(1)
        const {state} = writeMode
        try {
        state.foo = 1
        } catch (error) {
        expect(error.name).toBe('TypeError')
        }
    })
    it('prevents new nested property creation/assignments', () => {
        expect.assertions(1)
        const {state} = writeMode
        try {
        state.nest.foo = 1
        } catch (error) {
        expect(error.name).toBe('TypeError')
        }
    })
    it('should return undefined while getting an unknown property', () => {
        const {state} = readMode
        expect(state.foo).toBe(undefined)
    })
 })