import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BuildYou',
  description: '',
}

import NextAuthSessionProvider from './provider'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <NextAuthSessionProvider>
          <div>
            {children}
          </div>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
