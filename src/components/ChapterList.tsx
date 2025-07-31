'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDate, truncateText } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  FileText, 
  Edit, 
  Play, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye 
} from 'lucide-react'

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
}

interface ChapterListProps {
  chapters: Chapter[]
  onUpdate: () => void
}

export function ChapterList({ chapters, onUpdate }: ChapterListProps) {
  const [generatingChapters, setGeneratingChapters] = useState<Set<string>>(new Set())

  const handleGenerate = async (chapterId: string) => {
    if (!confirm('确定要开始生成这一章的内容吗？这可能需要几分钟时间。')) {
      return
    }

    setGeneratingChapters(prev => new Set(prev).add(chapterId))
    
    try {
      const response = await fetch(`/api/chapters/${chapterId}/generate`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('生成失败')
      }

      onUpdate()
    } catch (error) {
      console.error('生成章节失败:', error)
      alert('生成失败，请重试')
    } finally {
      setGeneratingChapters(prev => {
        const newSet = new Set(prev)
        newSet.delete(chapterId)
        return newSet
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'generating':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-400" />
    }
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

  if (chapters.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">还没有章节</h3>
        <p className="text-gray-600">添加第一个章节开始创作</p>
      </div>
    )
  }

  const sortedChapters = [...chapters].sort((a, b) => a.chapterNumber - b.chapterNumber)

  return (
    <div className="space-y-4">
      {sortedChapters.map((chapter) => (
        <div key={chapter.id} className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {getStatusIcon(chapter.status)}
                <h3 className="font-medium text-gray-900">
                  第{chapter.chapterNumber}章: {chapter.title}
                </h3>
                {getStatusBadge(chapter.status)}
              </div>
              
              {chapter.summary && (
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                  {truncateText(chapter.summary, 200)}
                </p>
              )}

              {chapter.status === 'generating' && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">生成进度</span>
                    <span className="text-xs text-gray-500">{chapter.progress}%</span>
                  </div>
                  <Progress value={chapter.progress} className="h-2" />
                </div>
              )}

              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>更新时间: {formatDate(new Date(chapter.updatedAt))}</span>
                {chapter.content && (
                  <span>字数: {chapter.content.length}</span>
                )}
              </div>
            </div>

            <div className="flex space-x-2 ml-4">
              {chapter.status === 'pending' && chapter.summary && (
                <Button
                  size="sm"
                  onClick={() => handleGenerate(chapter.id)}
                  disabled={generatingChapters.has(chapter.id)}
                >
                  <Play className="mr-1 h-3 w-3" />
                  {generatingChapters.has(chapter.id) ? '生成中...' : '生成内容'}
                </Button>
              )}
              
              {chapter.content && (
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/chapters/${chapter.id}`}>
                    <Eye className="mr-1 h-3 w-3" />
                    查看
                  </Link>
                </Button>
              )}
              
              <Button size="sm" variant="outline" asChild>
                <Link href={`/chapters/${chapter.id}/edit`}>
                  <Edit className="mr-1 h-3 w-3" />
                  编辑
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}