const types = {
  UPDATE_TWEET: 'UPDATE_TWEET',
  FETCH_TWEETS: 'FETCH_TWEETS',
}

export default types

export const updateTweet = (tweet) => ({
  type: types.UPDATE_TWEET,
  data: tweet,
})

export const fetchTweets = (tweets) => ({
  type: types.FETCH_TWEETS,
  data: tweets,
})
