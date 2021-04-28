import types from './actions'

const credentials = (state = [], { type, data }) => {
  switch (type) {
    case types.CREATE_CREDENTIAL:
      return state.concat(data)
    case types.FETCH_CREDENTIALS:
      return [...data]
    case types.DELETE_CREDENTIAL:
      return state.filter((credential) => credential.id !== data)
    default:
      return state
  }
}

export default credentials
