const types = {
  CREATE_RESPONSE: 'CREATE_RESPONSE',
  FETCH_RESPONSES: 'FETCH_RESPONSES',
  DELETE_RESPONSE: 'DELETE_RESPONSE',
  UPDATE_RESPONSE: 'UPDATE_RESPONSE',
}

export default types

export const createResponse = (response) => ({
  type: types.CREATE_RESPONSE,
  data: response,
})

export const fetchResponses = (responses) => ({
  type: types.FETCH_RESPONSES,
  data: responses,
})

export const deleteResponse = (id) => ({
  type: types.DELETE_RESPONSE,
  data: id,
})

export const updateResponse = (response) => ({
  type: types.UPDATE_RESPONSE,
  data: response,
})
