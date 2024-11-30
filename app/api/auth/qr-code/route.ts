import { NextResponse } from 'next/server'
import { generateQRCode } from '@/lib/telegramClient'

export async function GET() {
  console.log('QR Code generation API called')
  try {
    const url = await generateQRCode()
    const expires = Date.now() + 30000 // 30 seconds from now
    console.log('QR Code generated successfully')
    return NextResponse.json({ url, expires })
  } catch (error) {
    console.error('QR Code generation API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate QR code', 
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    )
  }
}

