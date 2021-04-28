const types = {
  CREATE_PROJECT: 'CREATE_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  FETCH_PROJECTS: 'FETCH_PROJECTS',
  DELETE_PROJECT: 'DELETE_PROJECT',
}

export default types

export const createProject = (project) => ({
  type: types.CREATE_PROJECT,
  data: project,
})

export const updateProject = (project) => ({
  type: types.UPDATE_PROJECT,
  data: project,
})

export const fetchProjects = (projects) => ({
  type: types.FETCH_PROJECTS,
  data: projects,
})

export const deleteProject = (id) => ({
  type: types.DELETE_PROJECT,
  data: id,
})
