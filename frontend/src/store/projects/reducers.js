import types from './actions'

const projects = (state = [], { type, data }) => {
  switch (type) {
    case types.CREATE_PROJECT:
      return state.concat(data)
    case types.FETCH_PROJECTS:
      return [...data]
    case types.UPDATE_PROJECT:
      return (
        state.map((project) => (
          project.id === data.id
            ? { ...data }
            : project
        ))
      )
    case types.DELETE_PROJECT:
      return state.filter((project) => project.id !== data)
    default:
      return state
  }
}

export default projects
