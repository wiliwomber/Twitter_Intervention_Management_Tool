import API_BASE_URL from '../config'

const request = async (endpoint, { isFetchingBinaryData, ...params }) => {
  const fetchOptions = { ...params }
  // eslint-disable-next-line no-restricted-globals

  const defaultHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
  }

  let query = ''
  if (params.method && params.method === 'GET' && params.query) {
    query += '?'

    if (params.query) {
      query += Object.entries(params.query) // eslint-disable-line prefer-template
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join('&')
    }
  }

  if (fetchOptions.body) {
    fetchOptions.body = JSON.stringify(fetchOptions.body)
  }

  fetchOptions.headers = {
    ...defaultHeaders,
    ...fetchOptions.headers,
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}${query}`, fetchOptions)

  if (res.ok) {
    if (res.status === 204) {
      return undefined
    }

    if (isFetchingBinaryData) {
      return res.blob()
    }

    const json = await res.json()

    return json
  }

  const error = await res.json()
  return error
}

export default {
  bots: {
    get: () => request('/bots', { method: 'GET' }),
    getOne: (id) => request(`/bots/${id}`, { method: 'GET' }),
    create: (body) => request('/bots', { method: 'POST', body }),
    update: (body) => request('/bots', { method: 'PUT', body }),
    delete: (body) => request('/bots', { method: 'DELETE', body }),
  },
  credentials: {
    get: () => request('/credentials', { method: 'GET' }),
    create: (body) => request('/credentials', { method: 'POST', body }),
    delete: (body) => request('/credentials', { method: 'DELETE', body }),
  },
  projects: {
    get: () => request('/projects', { method: 'GET' }),
    start: (id) => request(`/projects/start/${id}`, { method: 'GET' }),
    stop: (id) => request(`/projects/stop/${id}`, { method: 'GET' }),
    export: (id, target) =>
      request(`/projects/export/${id}?target=${target}`, {
        method: 'GET',
        isFetchingBinaryData: true,
      }),
    getOne: (id) => request(`/projects/${id}`, { method: 'GET' }),
    create: (body) => request('/projects', { method: 'POST', body }),
    update: (body) => request('/projects', { method: 'PUT', body }),
    delete: (body) => request('/projects', { method: 'DELETE', body }),
    intervene: (body) =>
      request('/projects/intervene', { method: 'POST', body }),
    testRules: (id, body) =>
      request(`/projects/testRules/${id}`, { method: 'POST', body }),
    reset: () => request('/projects/reset', { method: 'DELETE' }),
  },
  responses: {
    get: () => request('/responses', { method: 'GET' }),
    create: (body) => request('/responses', { method: 'POST', body }),
    update: (body) => request('/responses', { method: 'PUT', body }),
    delete: (body) => request('/responses', { method: 'DELETE', body }),
  },
  tweets: {
    get: () => request('/tweets', { method: 'GET' }),
    update: (body) => request('/tweets', { method: 'PUT', body }),
  },
}
