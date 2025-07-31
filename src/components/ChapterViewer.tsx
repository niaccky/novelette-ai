'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, BookOpen, Calendar, FileText } from 'lucide-react'

type Chapter = {
  id: string
  title: string
  summary?: string
  content?: string
  status: string
  progress: number
  chapterNumber: number
  createdAt: string
  updatedAt: string
  novel: {
    id: string
    title: string
    genre: string
  }
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface ChapterViewerProps {
  chapterId: string
}

export function ChapterViewer({ chapterId }: ChapterViewerProps) {
  const { data: chapter, error, isLoading } = useSWR<Chapter>(`/api/chapters/${chapterId}`, fetcher)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="h-8 bg-gray-300 rounded mb-4 w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !chapter) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">加载失败，请刷新页面重试</p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">已完成</Badge>
      case 'generating':
        return <Badge className="bg-blue-100 text-blue-800">生成中</Badge>
      case 'error':
        return <Badge variant="destructive">错误</Badge>
      default:
        return <Badge variant="secondary">待生成</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* 章节信息 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">
                第{chapter.chapterNumber}章: {chapter.title}
              </CardTitle>
              <CardDescription className="flex items-center space-x-4">
                <Link 
                  href={`/novels/${chapter.novel.id}`}
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <BookOpen className="mr-1 h-4 w-4" />
                  {chapter.novel.title}
                </Link>
                <Badge variant="outline">{chapter.novel.genre}</Badge>
                <span className="flex items-center text-gray-500">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDate(new Date(chapter.updatedAt))}
                </span>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(chapter.status)}
              <Link href={`/chapters/${chapter.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  编辑
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        
        {chapter.summary && (
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">章节概要</h3>
              <p className="text-gray-600 leading-relaxed">{chapter.summary}</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 章节内容 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            章节内容
            {chapter.content && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({chapter.content.length} 字)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chapter.content ? (
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-base">
                {chapter.content}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium mb-2">内容尚未生成</p>
              <p className="text-sm">
                {chapter.status === 'pending' ? '请先添加章节概要，然后点击"生成内容"' : '内容生成中，请稍候...'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}