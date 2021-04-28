import { combineReducers } from 'redux'
import credentials from './credentials/reducers'
import responses from './responses/reducers'
import projects from './projects/reducers'
import tweets from './tweets/reducers'

const rootReducer = combineReducers({
  credentials,
  projects,
  responses,
  tweets,
})

export default rootReducer
