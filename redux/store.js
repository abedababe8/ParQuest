import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import parkList from './parkReducer.js'
const rootReducer = combineReducers({
  parkList
})
export default createStore(rootReducer, applyMiddleware(thunk, logger))
