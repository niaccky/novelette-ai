import { Suspense } from 'react'
import { UserButton } from '@clerk/nextjs'
import { BookOpen, ArrowLeft } from 'lucide-react'
import { BackButton } from '@/components/ui/back-button'
import { ChapterEditor } from '@/components/ChapterEditor'

interface ChapterEditPageProps {
  params: { id: string }
}

export default function ChapterEditPage({ params }: ChapterEditPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <BackButton variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回
              </BackButton>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                <span className="text-lg font-semibold text-gray-900">编辑章节</span>
              </div>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center py-8">加载中...</div>}>
          <ChapterEditor chapterId={params.id} />
        </Suspense>
      </main>
    </div>
  )
}