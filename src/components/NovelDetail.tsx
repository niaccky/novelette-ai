'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CreateChapterDialog } from '@/components/CreateChapterDialog'
import { ChapterList } from '@/components/ChapterList'
import { Plus, BookOpen, Calendar, User, FileText } from 'lucide-react'

type Novel = {
  id: string
  title: string
  genre: string
  description?: string
  style: string
  status: string
  createdAt: string
  updatedAt: string
  chapters: Array<{
    id: string
    title: string
    summary?: string
    content?: string
    status: string
    progress: number
    chapterNumber: number
    createdAt: string
    updatedAt: string
  }>
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface NovelDetailProps {
  novelId: string
}

export function NovelDetail({ novelId }: NovelDetailProps) {
  const { data: novel, error, isLoading, mutate } = useSWR<Novel>(`/api/novels/${novelId}`, fetcher)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="h-8 bg-gray-300 rounded mb-4 w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/4"></div>
            <div className="h-20 bg-gray-100 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
        <div className="animate-pulse bg-white rounded-lg p-6 shadow-sm border">
          <div className="h-6 bg-gray-300 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !novel) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">加载失败，请刷新页面重试</p>
      </div>
    )
  }

  const completedChapters = novel.chapters.filter(ch => ch.status === 'completed').length
  const totalChapters = novel.chapters.length
  const completionRate = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0

  return (
    <div className="space-y-6">
      {/* 小说信息卡片 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{novel.title}</CardTitle>
              <CardDescription className="flex items-center space-x-4">
                <Badge variant="secondary">{novel.genre}</Badge>
                <Badge variant="outline">{novel.style}</Badge>
                <span className="flex items-center text-gray-500">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDate(new Date(novel.updatedAt))}
                </span>
              </CardDescription>
            </div>
            <Badge className={novel.status === 'draft' ? 'bg-yellow-500' : 'bg-green-500'}>
              {novel.status === 'draft' ? '草稿' : '完成'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {novel.description && (
            <p className="text-gray-600 mb-6 leading-relaxed">{novel.description}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {totalChapters} 章节
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {completedChapters} 已完成
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {Math.round(completionRate)}% 完成度
              </span>
            </div>
          </div>

          {totalChapters > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">进度</span>
                <span className="text-sm text-gray-500">{completedChapters}/{totalChapters}</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 章节管理区域 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>章节管理</CardTitle>
            <CreateChapterDialog novelId={novelId} onSuccess={() => mutate()}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                添加章节
              </Button>
            </CreateChapterDialog>
          </div>
        </CardHeader>
        <CardContent>
          <ChapterList chapters={novel.chapters} onUpdate={() => mutate()} />
        </CardContent>
      </Card>
    </div>
  )
}