'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

interface CreateChapterDialogProps {
  novelId: string
  children: React.ReactNode
  onSuccess: () => void
}

export function CreateChapterDialog({ novelId, children, onSuccess }: CreateChapterDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    summary: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title) {
      alert('请输入章节标题')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/chapters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          novelId,
          ...formData
        }),
      })

      if (!response.ok) {
        throw new Error('创建失败')
      }

      setOpen(false)
      setFormData({ title: '', summary: '' })
      onSuccess()
    } catch (error) {
      console.error('创建章节失败:', error)
      alert('创建失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md z-50">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">添加新章节</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                章节标题 *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="输入章节标题"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                章节概要
              </label>
              <Textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="简单描述这一章的主要内容和情节发展..."
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                详细的章节概要有助于AI生成更符合您期望的内容
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <Dialog.Close asChild>
                <Button type="button" variant="outline" className="flex-1">
                  取消
                </Button>
              </Dialog.Close>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? '创建中...' : '创建章节'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}