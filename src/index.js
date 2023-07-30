import {normalizeArguments} from './normalizer.js'
import api from './api.js'
export default (model, notifyFn, options={}) => {
  const {nOptions, nNotifyFn} = normalizeArguments(notifyFn, options)
  return api (model, nNotifyFn, nOptions)
}




