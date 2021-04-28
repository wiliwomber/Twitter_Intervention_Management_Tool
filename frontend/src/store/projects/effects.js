import { omit } from 'lodash'
import api from '../../utils/api'
import * as actions from './actions'
import makeSelectProject from './selectors'

export const fetchProjects = () => async (dispatch) => {
  const projects = await api.projects.get()
  dispatch(actions.fetchProjects(projects))
  return projects
}

export const createProject = (data) => async (dispatch) => {
  const project = await api.projects.create(data)
  dispatch(actions.createProject(project))
  return project
}

export const updateProject = (data) => async (dispatch) => {
  const dataWithoutTweets = omit(data, 'queryTweets')
  const updatedProject = await api.projects.update(dataWithoutTweets)
  dispatch(actions.updateProject(updatedProject))
  return updatedProject
}

export const deleteProject = (id) => async (dispatch) => {
  const project = await api.projects.delete({ id })
  dispatch(actions.deleteProject(id))
  return project
}

const selectProject = makeSelectProject()

export const fetchProject = (id) => async (dispatch, getState) => {
  const project = selectProject(getState(), id)
  const data = project || await api.projects.getOne(id)
  return data[0]
}
