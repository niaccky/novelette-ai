import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { zhCN } from '@clerk/localizations'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI小说生成器',
  description: '基于AI的智能小说创作平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={zhCN as any}>
      <html lang="zh-CN">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}