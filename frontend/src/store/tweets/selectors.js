import { createSelector } from 'reselect'
import { find } from 'lodash'

const getLocalState = (state) => state.tweets

const makeSelectProjectTweets = () => createSelector(
  getLocalState,
  (_, props) => props,
  (tweets, project_id) => find(tweets, ['project_id', project_id])
)

export default makeSelectProjectTweets
