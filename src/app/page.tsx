import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, PenTool, Sparkles, Users } from 'lucide-react'

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 导航栏 */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-900">AI小说生成器</span>
        </div>
        <div className="space-x-4">
          <Link href="/sign-in">
            <Button variant="ghost">登录</Button>
          </Link>
          <Link href="/sign-up">
            <Button>注册</Button>
          </Link>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="container mx-auto px-4">
        {/* 英雄区域 */}
        <section className="text-center py-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI驱动的
            <span className="text-indigo-600">智能小说创作</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            输入章节概要，选择小说类型，让AI为您生成精彩的小说内容。
            告别创作瓶颈，开启无限创意之旅。
          </p>
          <div className="space-x-4">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8 py-3">
                <Sparkles className="mr-2 h-5 w-5" />
                免费开始创作
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              了解更多
            </Button>
          </div>
        </section>

        {/* 功能特色 */}
        <section className="py-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            为什么选择我们的AI小说生成器？
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <PenTool className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4">智能创作</h3>
              <p className="text-gray-600">
                先进的AI算法理解您的创作意图，生成符合您要求的高质量小说内容。
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <BookOpen className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4">多样类型</h3>
              <p className="text-gray-600">
                支持玄幻、言情、都市、历史等多种小说类型，满足不同创作需求。
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <Users className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4">简单易用</h3>
              <p className="text-gray-600">
                直观的界面设计，只需几步操作就能开始创作，无需复杂的技术知识。
              </p>
            </div>
          </div>
        </section>

        {/* CTA区域 */}
        <section className="bg-indigo-600 rounded-lg py-16 px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">准备开始您的创作之旅了吗？</h2>
          <p className="text-xl mb-8 opacity-90">
            加入数千位作家，使用AI技术释放您的创作潜能
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              立即免费注册
            </Button>
          </Link>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 AI小说生成器. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  )
}