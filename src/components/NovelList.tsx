'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { formatDate, truncateText } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Calendar, FileText, Plus } from 'lucide-react'

type Novel = {
  id: string
  title: string
  genre: string
  description?: string
  status: string
  createdAt: string
  updatedAt: string
  chapters: {
    id: string
    title: string
    status: string
    chapterNumber: number
  }[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function NovelList() {
  const { data: novels, error, isLoading } = useSWR<Novel[]>('/api/novels', fetcher)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
              <div className="h-20 bg-gray-100 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">加载失败，请刷新页面重试</p>
      </div>
    )
  }

  if (!novels || !Array.isArray(novels) || novels.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">还没有小说</h3>
        <p className="text-gray-600 mb-6">创建您的第一部小说，开始AI创作之旅</p>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          创建小说
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.isArray(novels) && novels.map((novel) => (
        <Card key={novel.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">{novel.title}</CardTitle>
            <CardDescription className="flex items-center space-x-4 text-sm">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {novel.genre}
              </span>
              <span className="flex items-center text-gray-500">
                <Calendar className="mr-1 h-3 w-3" />
                {formatDate(new Date(novel.updatedAt))}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {novel.description && (
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {truncateText(novel.description, 120)}
              </p>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <FileText className="mr-1 h-4 w-4" />
                <span>{novel.chapters.length} 章节</span>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                novel.status === 'draft' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {novel.status === 'draft' ? '草稿' : '完成'}
              </span>
            </div>

            <Link href={`/novels/${novel.id}`}>
              <Button className="w-full">
                查看详情
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}