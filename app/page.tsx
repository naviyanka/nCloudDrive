'use client'

import { useState, useEffect, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [qrCodeData, setQrCodeData] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [loginStatus, setLoginStatus] = useState<'pending' | 'success' | 'expired' | 'invalid' | null>(null)

  const generateQRCode = useCallback(async () => {
    try {
      setIsLoading(true)
      setLoginStatus(null)
      const response = await fetch('/api/auth/qr-code')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate QR code')
      }
      
      if (!data.url) {
        throw new Error('No QR code URL received')
      }

      setQrCodeData(data.url)
      setError('')

      // Start polling for login status
      const token = data.url.split('token=')[1]
      pollLoginStatus(token)
    } catch (err) {
      console.error('Error generating QR code:', err)
      setError(`Failed to generate QR code: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const pollLoginStatus = useCallback(async (token: string) => {
    try {
      const response = await fetch('/api/auth/check-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      })
      
      if (!response.ok) {
        throw new Error('Failed to check login status')
      }

      const data = await response.json()

      if (data.status === 'success') {
        setLoginStatus('success')
        // Save session and redirect to dashboard
        localStorage.setItem('telegram_session', 'logged_in')
        setTimeout(() => router.push('/dashboard'), 1000)
        return
      }

      if (data.status === 'expired' || data.status === 'invalid') {
        setLoginStatus(data.status)
        return
      }

      // Continue polling every second for pending status
      setTimeout(() => pollLoginStatus(token), 1000)
    } catch (err) {
      console.error('Error checking login status:', err)
      setError(`Failed to check login status: ${err.message}`)
    }
  }, [router])

  useEffect(() => {
    generateQRCode()

    // Refresh QR code every 30 seconds
    const interval = setInterval(generateQRCode, 30000)
    return () => clearInterval(interval)
  }, [generateQRCode])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-96 space-y-8">
        <div className="space-y-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Log in to Telegram by QR Code
          </h1>
          <ol className="space-y-4 text-gray-600">
            <li className="flex items-center space-x-3">
              <span className="flex-none w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                1
              </span>
              <span>Open Telegram on your phone</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="flex-none w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                2
              </span>
              <span>Go to Settings → Devices → Link Desktop Device</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="flex-none w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                3
              </span>
              <span>Point your phone at this screen to confirm login</span>
            </li>
          </ol>
        </div>
        <div className="flex flex-col items-center">
          {isLoading ? (
            <div className="w-64 h-64 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : loginStatus === 'success' ? (
            <div className="text-center text-green-500">
              <p>Login successful! Redirecting...</p>
            </div>
          ) : loginStatus === 'expired' ? (
            <div className="text-center">
              <p className="text-amber-500">QR code expired</p>
              <button
                onClick={generateQRCode}
                className="mt-4 text-blue-500 hover:text-blue-600"
              >
                Generate New Code
              </button>
            </div>
          ) : loginStatus === 'invalid' ? (
            <div className="text-center">
              <p className="text-red-500">Invalid QR code</p>
              <button
                onClick={generateQRCode}
                className="mt-4 text-blue-500 hover:text-blue-600"
              >
                Generate New Code
              </button>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">
              <p>{error}</p>
              <button
                onClick={generateQRCode}
                className="mt-4 text-blue-500 hover:text-blue-600"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="p-4 bg-white rounded-lg">
              <QRCodeSVG 
                value={qrCodeData} 
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

