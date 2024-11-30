const TELEGRAM_GATEWAY_URL = 'https://api.telegram.org'

export async function createAuthToken() {
  const response = await fetch(`${TELEGRAM_GATEWAY_URL}/auth/exportLoginToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_id: 22339815,
      api_hash: 'a599e51490f73ddc843099a0dcd1b8b5',
      scope: 'auth.qrlogin',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create auth token')
  }

  return response.json()
}

export async function checkAuthStatus(token: string) {
  const response = await fetch(`${TELEGRAM_GATEWAY_URL}/auth/checkLoginToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  })

  if (!response.ok) {
    throw new Error('Failed to check auth status')
  }

  return response.json()
}

