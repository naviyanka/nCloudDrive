import { NextResponse } from 'next/server'
import { checkAuthStatus } from '@/lib/telegram-gateway'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()
    const status = await checkAuthStatus(token)
    return NextResponse.json(status)
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check login status' },
      { status: 500 }
    )
  }
}

