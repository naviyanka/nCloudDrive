import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions'
import { Api } from 'telegram/tl'

const apiId = 22339815
const apiHash = 'a599e51490f73ddc843099a0dcd1b8b5'

let client: TelegramClient | null = null

export async function getClient(): Promise<TelegramClient> {
  if (!client) {
    console.log('Creating new TelegramClient instance...')
    client = new TelegramClient(new StringSession(""), apiId, apiHash, {
      connectionRetries: 5,
    })
    console.log('Connecting to Telegram...')
    try {
      await client.connect()
      console.log('Connected to Telegram successfully')
    } catch (error) {
      console.error('Error connecting to Telegram:', error)
      throw error
    }
  }
  return client
}

export async function generateQRCode(): Promise<string> {
  console.log('Generating QR Code...')
  try {
    const client = await getClient()
    console.log('Invoking auth.exportLoginToken...')
    const result = await client.invoke(new Api.auth.ExportLoginToken({
      apiId: client.apiId,
      apiHash: client.apiHash,
      exceptIds: []
    }))

    console.log('QR Code generation result:', JSON.stringify(result, null, 2))

    if (!(result instanceof Api.auth.LoginToken)) {
      throw new Error(`Unexpected response from Telegram API: ${JSON.stringify(result)}`)
    }

    const token = Buffer.from(result.token).toString('base64url')
    const url = `tg://login?token=${token}`
    console.log('Generated QR Code URL:', url)
    return url
  } catch (error) {
    console.error('Error generating QR Code:', error)
    throw error
  }
}

export async function checkLoginStatus(token: string): Promise<'success' | 'pending' | 'expired' | 'invalid'> {
  console.log('Checking login status...')
  const client = await getClient()
  try {
    const result = await client.invoke(new Api.auth.ImportLoginToken({
      token: Buffer.from(token, 'base64url')
    }))

    console.log('Login status check result:', result)

    if (result instanceof Api.auth.LoginTokenSuccess) {
      return 'success'
    }
    return 'pending'
  } catch (error: any) {
    console.error('Error checking login status:', error)
    if (error.message.includes('AUTH_TOKEN_EXPIRED')) {
      return 'expired'
    }
    if (error.message.includes('AUTH_TOKEN_INVALID')) {
      return 'invalid'
    }
    throw error
  }
}

