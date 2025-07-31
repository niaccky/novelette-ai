import { SignUp } from '@clerk/nextjs'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* 导航栏 */}
      <nav className="container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-900">AI小说生成器</span>
        </Link>
      </nav>

      {/* 主要内容 */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">开始创作</h1>
            <p className="text-gray-600">创建账户，开启您的AI小说创作之旅</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-50",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500",
                  formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
                  footerActionLink: "text-indigo-600 hover:text-indigo-700"
                }
              }}
            />
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              已有账户？{' '}
              <Link href="/sign-in" className="text-indigo-600 hover:text-indigo-700 font-medium">
                立即登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}