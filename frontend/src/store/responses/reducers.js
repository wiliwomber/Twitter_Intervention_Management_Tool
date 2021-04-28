import types from './actions'

const responses = (state = [], { type, data }) => {
  switch (type) {
    case types.CREATE_RESPONSE:
      return state.concat(data)
    case types.UPDATE_RESPONSE:
      return [...state, data]
    case types.FETCH_RESPONSES:
      return [...data]
    case types.DELETE_RESPONSE:
      return state.filter((response) => response.id !== data)
    default:
      return state
  }
}

export default responses
