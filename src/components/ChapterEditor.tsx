'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Save, Play, RefreshCw, Eye } from 'lucide-react'
import Link from 'next/link'

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
    style: string
  }
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface ChapterEditorProps {
  chapterId: string
}

export function ChapterEditor({ chapterId }: ChapterEditorProps) {
  const router = useRouter()
  const { data: chapter, error, isLoading, mutate } = useSWR<Chapter>(`/api/chapters/${chapterId}`, fetcher)
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // 自动保存功能
  useEffect(() => {
    if (!chapter) return

    setFormData({
      title: chapter.title || '',
      summary: chapter.summary || '',
      content: chapter.content || ''
    })
  }, [chapter])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('saving')
    
    try {
      const response = await fetch(`/api/chapters/${chapterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('保存失败')
      }

      setSaveStatus('saved')
      mutate()
      
      // 2秒后重置状态
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('保存失败:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerate = async () => {
    if (!formData.summary.trim()) {
      alert('请先填写章节概要')
      return
    }

    if (!confirm('生成新内容会覆盖当前内容，确定继续吗？')) {
      return
    }

    // 先保存概要
    await handleSave()

    setIsGenerating(true)
    
    try {
      const response = await fetch(`/api/chapters/${chapterId}/generate`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('生成失败')
      }

      const updatedChapter = await response.json()
      setFormData({
        ...formData,
        content: updatedChapter.content || ''
      })
      mutate()
    } catch (error) {
      console.error('生成章节失败:', error)
      alert('生成失败，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerate = async () => {
    if (!confirm('重新生成会替换当前内容，确定继续吗？')) {
      return
    }
    
    await handleGenerate()
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

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving':
        return '保存中...'
      case 'saved':
        return '已保存'
      case 'error':
        return '保存失败'
      default:
        return '保存'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="h-8 bg-gray-300 rounded mb-4 w-1/2"></div>
            <div className="h-32 bg-gray-100 rounded mb-4"></div>
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

  return (
    <div className="space-y-6">
      {/* 章节信息 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">
                编辑第{chapter.chapterNumber}章
              </CardTitle>
              <CardDescription className="flex items-center space-x-4">
                <Link 
                  href={`/novels/${chapter.novel.id}`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  {chapter.novel.title}
                </Link>
                <Badge variant="outline">{chapter.novel.genre}</Badge>
                <Badge variant="outline">{chapter.novel.style}</Badge>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(chapter.status)}
              <Link href={`/chapters/${chapter.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  预览
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 编辑表单 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：基本信息和概要 */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  章节标题
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="输入章节标题"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  章节概要
                </label>
                <Textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="描述这一章的主要内容和情节发展..."
                  rows={8}
                />
                <p className="text-xs text-gray-500 mt-1">
                  详细的概要有助于AI生成更符合期望的内容
                </p>
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  variant="outline"
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {getSaveButtonText()}
                </Button>
                
                {formData.summary && (
                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !formData.summary.trim()}
                    className="flex-1"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {isGenerating ? '生成中...' : '生成内容'}
                  </Button>
                )}
              </div>

              {isGenerating && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">生成进度</span>
                    <span className="text-xs text-gray-500">{chapter.progress}%</span>
                  </div>
                  <Progress value={chapter.progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 右侧：内容编辑 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>章节内容</CardTitle>
                {formData.content && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {formData.content.length} 字
                    </span>
                    {formData.summary && (
                      <Button 
                        onClick={handleRegenerate}
                        disabled={isGenerating}
                        variant="outline"
                        size="sm"
                      >
                        <RefreshCw className="mr-2 h-3 w-3" />
                        重新生成
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder={formData.summary ? '点击"生成内容"让AI为您创作，或在此直接编写...' : '请先填写章节概要'}
                rows={25}
                className="resize-none font-mono text-sm leading-relaxed"
              />
              
              <div className="flex justify-between items-center mt-4">
                <p className="text-xs text-gray-500">
                  支持直接编辑AI生成的内容，修改后记得保存
                </p>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className={saveStatus === 'saved' ? 'bg-green-600' : ''}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {getSaveButtonText()}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}