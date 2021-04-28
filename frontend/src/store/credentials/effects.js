import api from '../../utils/api'
import * as actions from './actions'

export const fetchCredentials = () => async (dispatch) => {
  const credentials = await api.credentials.get()
  await dispatch(actions.fetchCredentials(credentials))
  return credentials
}

export const createCredential = (data) => async (dispatch) => {
  const credential = await api.credentials.create(data)
  await dispatch(actions.createCredential(credential))
  return credential
}

export const deleteCredential = (id) => async (dispatch) => {
  const credential = await api.credentials.delete({ id })
  await dispatch(actions.deleteCredential(id))
  return credential
}
