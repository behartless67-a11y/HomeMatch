import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HomeMatch - Find Your Dream Home',
  description: 'Tinder-style house hunting app. Swipe right to like properties, left to pass.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
