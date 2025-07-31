import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// 获取特定小说详情
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

    const novel = await prisma.novel.findFirst({
      where: { 
        id: params.id,
        userId: user.id
      },
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' }
        }
      }
    })

    if (!novel) {
      return NextResponse.json({ error: '小说不存在' }, { status: 404 })
    }

    return NextResponse.json(novel)
  } catch (error) {
    console.error('获取小说详情失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// 更新小说信息
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

    const { title, genre, description, style, status } = await request.json()

    const novel = await prisma.novel.updateMany({
      where: { 
        id: params.id,
        userId: user.id
      },
      data: {
        ...(title && { title }),
        ...(genre && { genre }),
        ...(description !== undefined && { description }),
        ...(style && { style }),
        ...(status && { status }),
      }
    })

    if (novel.count === 0) {
      return NextResponse.json({ error: '小说不存在或无权限' }, { status: 404 })
    }

    const updatedNovel = await prisma.novel.findUnique({
      where: { id: params.id },
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' }
        }
      }
    })

    return NextResponse.json(updatedNovel)
  } catch (error) {
    console.error('更新小说失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// 删除小说
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

    const deleted = await prisma.novel.deleteMany({
      where: { 
        id: params.id,
        userId: user.id
      }
    })

    if (deleted.count === 0) {
      return NextResponse.json({ error: '小说不存在或无权限' }, { status: 404 })
    }

    return NextResponse.json({ message: '小说删除成功' })
  } catch (error) {
    console.error('删除小说失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}