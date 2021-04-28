import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducer'

const middleware = applyMiddleware(thunk)

/* eslint-disable no-underscore-dangle */
const enhancer = window.__REDUX_DEVTOOLS_EXTENSION__ 
  ? compose(middleware, window.__REDUX_DEVTOOLS_EXTENSION__())
  : middleware

const store = createStore(rootReducer, enhancer)

export default store
