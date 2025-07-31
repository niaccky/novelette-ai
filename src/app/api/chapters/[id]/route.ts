import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// 获取章节详情
export async function GET(
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

    const chapter = await prisma.chapter.findFirst({
      where: { 
        id: params.id,
        novel: {
          userId: user.id
        }
      },
      include: {
        novel: true,
        tasks: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!chapter) {
      return NextResponse.json({ error: '章节不存在' }, { status: 404 })
    }

    return NextResponse.json(chapter)
  } catch (error) {
    console.error('获取章节详情失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// 更新章节
export async function PUT(
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

    const { title, summary, content, status } = await request.json()

    const chapter = await prisma.chapter.updateMany({
      where: { 
        id: params.id,
        novel: {
          userId: user.id
        }
      },
      data: {
        ...(title && { title }),
        ...(summary !== undefined && { summary }),
        ...(content !== undefined && { content }),
        ...(status && { status }),
      }
    })

    if (chapter.count === 0) {
      return NextResponse.json({ error: '章节不存在或无权限' }, { status: 404 })
    }

    const updatedChapter = await prisma.chapter.findUnique({
      where: { id: params.id },
      include: {
        novel: true
      }
    })

    return NextResponse.json(updatedChapter)
  } catch (error) {
    console.error('更新章节失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// 删除章节
export async function DELETE(
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

    const deleted = await prisma.chapter.deleteMany({
      where: { 
        id: params.id,
        novel: {
          userId: user.id
        }
      }
    })

    if (deleted.count === 0) {
      return NextResponse.json({ error: '章节不存在或无权限' }, { status: 404 })
    }

    return NextResponse.json({ message: '章节删除成功' })
  } catch (error) {
    console.error('删除章节失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}