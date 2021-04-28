import api from '../../utils/api'
import * as actions from './actions'

export const fetchTweets = () => async (dispatch) => {
  const tweets = await api.tweets.get()
  dispatch(actions.fetchTweets(tweets))
  return tweets
}

export const updateTweet = (data) => async (dispatch) => {
  const updatedTweet = await api.tweets.update(data)
  dispatch(actions.updateTweet(updatedTweet))
  return updatedTweet
}

export const fetchProjectTweets = (project_id) => async (dispatch) => {
  const tweets = await api.tweets.get()
  dispatch(actions.fetchTweets(tweets))
  const projectTweets = tweets.filter((tweet) => tweet.project_id === project_id)
  return projectTweets
}
