import { NextResponse } from 'next/server'
import { checkLoginStatus } from '@/lib/telegramClient'

export async function POST(request: Request) {
  console.log('Check login status API called')
  try {
    const { token } = await request.json()
    console.log('Received token:', token)
    const status = await checkLoginStatus(token)
    console.log('Login status:', status)
    return NextResponse.json({ status })
  } catch (error) {
    console.error('Login status check API error:', error)
    return NextResponse.json(
      { error: 'Failed to check login status', details: error.message },
      { status: 500 }
    )
  }
}

