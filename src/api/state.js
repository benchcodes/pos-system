import { buildApiUrl, getNetworkErrorMessage, isRemoteSyncEnabled } from './config'

export { isRemoteSyncEnabled }

async function request(url, options = {}) {
  let response
  try {
    response = await fetch(buildApiUrl(url), {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new Error(getNetworkErrorMessage())
  }

  if (!response.ok) {
    let message = 'Request failed'
    try {
      const body = await response.json()
      if (body?.message) {
        message = body.message
      }
    } catch {
      // Ignore parse errors and keep default message.
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function fetchAppState() {
  return request('/api/state')
}

export function saveAppState(state) {
  return request('/api/state', {
    method: 'PUT',
    body: JSON.stringify(state),
  })
}
