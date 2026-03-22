const apiBaseUrl = String(import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '')

const rawSyncFlag = String(import.meta.env.VITE_ENABLE_REMOTE_SYNC ?? '').trim().toLowerCase()
const hasExplicitSyncFlag = rawSyncFlag === 'true' || rawSyncFlag === 'false'

export const isRemoteSyncEnabled = hasExplicitSyncFlag
  ? rawSyncFlag === 'true'
  : import.meta.env.DEV || Boolean(apiBaseUrl)

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

  return 'Cloud sync is disabled. Set VITE_API_BASE_URL and redeploy to enable online sync.'
}
