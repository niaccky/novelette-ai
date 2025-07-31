import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// 获取用户的所有小说
export async function GET() {
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

    const novels = await prisma.novel.findMany({
      where: { userId: user.id },
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(novels)
  } catch (error) {
    console.error('获取小说列表失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// 创建新小说
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { title, genre, description, style } = await request.json()

    if (!title || !genre) {
      return NextResponse.json({ error: '标题和类型为必填项' }, { status: 400 })
    }

    // 查找或创建用户
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }).then(res => res.json())

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.email_addresses[0]?.email_address || '',
          username: clerkUser.username || clerkUser.first_name || 'User',
        }
      })
    }

    const novel = await prisma.novel.create({
      data: {
        title,
        genre,
        description,
        style: style || 'modern',
        userId: user.id,
      },
      include: {
        chapters: true
      }
    })

    return NextResponse.json(novel, { status: 201 })
  } catch (error) {
    console.error('创建小说失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}