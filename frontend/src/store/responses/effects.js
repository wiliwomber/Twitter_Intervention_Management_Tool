import api from '../../utils/api'
import * as actions from './actions'

export const fetchResponses = () => async (dispatch) => {
  const responses = await api.responses.get()
  dispatch(actions.fetchResponses(responses))
  return responses
}

export const createResponse = (data) => async (dispatch) => {
  const response = await api.responses.create(data)
  dispatch(actions.createResponse(response))
  return response
}

export const deleteResponse = (id) => async (dispatch) => {
  const response = await api.responses.delete({ id })
  dispatch(actions.deleteResponse(id))
  return response
}

export const updateResponse = (data) => async (dispatch) => {
  const response = await api.responses.update(data)
  dispatch(actions.updateResponse(response))
  return response
}
