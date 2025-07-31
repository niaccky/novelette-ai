import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// 创建新章节
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { novelId, title, summary } = await request.json()

    if (!novelId || !title) {
      return NextResponse.json({ error: '小说ID和标题为必填项' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // 验证小说是否属于该用户
    const novel = await prisma.novel.findFirst({
      where: { 
        id: novelId,
        userId: user.id
      }
    })

    if (!novel) {
      return NextResponse.json({ error: '小说不存在或无权限' }, { status: 404 })
    }

    // 获取下一个章节号
    const lastChapter = await prisma.chapter.findFirst({
      where: { novelId },
      orderBy: { chapterNumber: 'desc' }
    })

    const chapterNumber = (lastChapter?.chapterNumber || 0) + 1

    const chapter = await prisma.chapter.create({
      data: {
        novelId,
        title,
        summary,
        chapterNumber,
        status: 'pending',
      }
    })

    return NextResponse.json(chapter, { status: 201 })
  } catch (error) {
    console.error('创建章节失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}