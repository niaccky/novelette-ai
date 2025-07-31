import { Suspense } from 'react'
import { UserButton } from '@clerk/nextjs'
import { BookOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NovelList } from '@/components/NovelList'
import { CreateNovelDialog } from '@/components/CreateNovelDialog'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <h1 className="text-xl font-semibold text-gray-900">AI小说生成器</h1>
            </div>
            <div className="flex items-center space-x-4">
              <CreateNovelDialog>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  创建小说
                </Button>
              </CreateNovelDialog>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">我的小说</h2>
          <p className="text-gray-600">管理您的小说项目，创建和编辑章节内容</p>
        </div>

        <Suspense fallback={<div className="text-center py-8">加载中...</div>}>
          <NovelList />
        </Suspense>
      </main>
    </div>
  )
}