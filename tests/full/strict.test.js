import { jest } from '@jest/globals';
import oneStop from '../../src/index.js'
import model from '../model.js'
let shop, readMode, writeMode
beforeEach (
  () => {
    shop = oneStop(model, ()=> {}, {strict:true})
    readMode = shop.readMode
    writeMode = shop.writeMode
  }
)
describe("full + strict tests,", () => {
  it('can not access to state', () => {
    expect.assertions(1)
    expect(writeMode.state).toBeUndefined()
  })
  it('should update via fn', () => {
    const {state, increment, getCount} = writeMode
    increment(1)
    expect(getCount()).toBe(1)
  })
  it('reads via a fn', () => {
    const {isZeroCount} = readMode
    expect(isZeroCount()).toBe(true)
  })
 })