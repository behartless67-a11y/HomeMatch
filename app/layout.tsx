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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
