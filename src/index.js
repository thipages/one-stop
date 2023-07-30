import notifier from './notifier.js'
import {normalizeArguments} from './normalize.js'
import api from './api.js'
//
export default (model, notifyChanges, options={}) => {
  const {options: opts, notify} = normalizeArguments(notifyChanges, options)
  return api (model, notify, opts)
}




