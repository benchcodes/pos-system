const configuredApiBaseUrl = String(import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '')

const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i
const isInvalidProdApiBase = import.meta.env.PROD && localhostPattern.test(configuredApiBaseUrl)
const apiBaseUrl = isInvalidProdApiBase ? '' : configuredApiBaseUrl

const rawSyncFlag = String(import.meta.env.VITE_ENABLE_REMOTE_SYNC ?? '').trim().toLowerCase()
const hasExplicitSyncFlag = rawSyncFlag === 'true' || rawSyncFlag === 'false'

export const isRemoteSyncEnabled = hasExplicitSyncFlag
  ? rawSyncFlag === 'true'
  : true

export function buildApiUrl(path) {
  if (!path.startsWith('/')) {
    throw new Error('API path must start with "/"')
  }

  return apiBaseUrl ? `${apiBaseUrl}${path}` : path
}

export function getNetworkErrorMessage() {
  if (apiBaseUrl) {
    return 'Cannot reach API server. Please check your backend URL and deployment status.'
  }

  return 'Cannot reach API server. Please check your deployment status and API routes.'
}
