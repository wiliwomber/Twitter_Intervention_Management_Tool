import types from './actions'

const tweets = (state = [], { type, data }) => {
  switch (type) {
    case types.FETCH_TWEETS:
      return [...data]
    case types.UPDATE_TWEET:
      return (
        state.map((tweet) => (
          tweet.id === data.id
            ? { ...data }
            : tweet
        ))
      )
    default:
      return state
  }
}

export default tweets
