import { buildApiUrl, getNetworkErrorMessage } from './config'

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

export function fetchProducts() {
  return request('/api/products')
}

export function createProduct(product) {
  return request('/api/products', {
    method: 'POST',
    body: JSON.stringify(product),
  })
}

export function updateProduct(id, product) {
  return request(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  })
}

export function deleteProduct(id) {
  return request(`/api/products/${id}`, {
    method: 'DELETE',
  })
}
