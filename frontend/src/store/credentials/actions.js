const types = {
  CREATE_CREDENTIAL: 'CREATE_CREDENTIAL',
  FETCH_CREDENTIALS: 'FETCH_CREDENTIALS',
  DELETE_CREDENTIAL: 'DELETE_CREDENTIAL',
}

export default types

export const createCredential = (credential) => ({
  type: types.CREATE_CREDENTIAL,
  data: credential,
})

export const fetchCredentials = (credentials) => ({
  type: types.FETCH_CREDENTIALS,
  data: credentials,
})

export const deleteCredential = (id) => ({
  type: types.DELETE_CREDENTIAL,
  data: id,
})
