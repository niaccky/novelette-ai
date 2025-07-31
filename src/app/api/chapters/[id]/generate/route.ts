import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { generateChapterContent } from '@/lib/openai'

// 生成章节内容
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // 获取章节和相关小说信息
    const chapter = await prisma.chapter.findFirst({
      where: { 
        id: params.id,
        novel: {
          userId: user.id
        }
      },
      include: {
        novel: true
      }
    })

    if (!chapter) {
      return NextResponse.json({ error: '章节不存在' }, { status: 404 })
    }

    if (!chapter.summary) {
      return NextResponse.json({ error: '章节概要不能为空' }, { status: 400 })
    }

    // 更新状态为生成中
    await prisma.chapter.update({
      where: { id: params.id },
      data: { 
        status: 'generating',
        progress: 10
      }
    })

    try {
      // 获取前文内容用于保持连贯性
      const previousChapter = await prisma.chapter.findFirst({
        where: {
          novelId: chapter.novelId,
          chapterNumber: { lt: chapter.chapterNumber }
        },
        orderBy: { chapterNumber: 'desc' }
      })

      // 创建生成任务记录
      const task = await prisma.generationTask.create({
        data: {
          chapterId: chapter.id,
          taskType: 'chapter_generation',
          status: 'running',
          parameters: {
            summary: chapter.summary,
            genre: chapter.novel.genre,
            style: chapter.novel.style,
            chapterNumber: chapter.chapterNumber,
            novelTitle: chapter.novel.title
          }
        }
      })

      // 更新进度
      await prisma.chapter.update({
        where: { id: params.id },
        data: { progress: 30 }
      })

      // 调用AI生成内容
      const generatedContent = await generateChapterContent(
        chapter.summary,
        chapter.novel.genre,
        chapter.novel.style,
        chapter.chapterNumber,
        chapter.novel.title,
        previousChapter?.content || undefined
      )

      // 更新进度
      await prisma.chapter.update({
        where: { id: params.id },
        data: { progress: 80 }
      })

      // 保存生成的内容
      const updatedChapter = await prisma.chapter.update({
        where: { id: params.id },
        data: { 
          content: generatedContent,
          status: 'completed',
          progress: 100
        },
        include: {
          novel: true
        }
      })

      // 更新任务状态
      await prisma.generationTask.update({
        where: { id: task.id },
        data: {
          status: 'completed',
          progress: 100,
          result: generatedContent
        }
      })

      return NextResponse.json(updatedChapter)
    } catch (aiError) {
      console.error('AI生成失败:', aiError)
      
      // 更新状态为失败
      await prisma.chapter.update({
        where: { id: params.id },
        data: { 
          status: 'error',
          progress: 0
        }
      })

      return NextResponse.json(
        { error: 'AI生成失败，请稍后重试' }, 
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('生成章节内容失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}