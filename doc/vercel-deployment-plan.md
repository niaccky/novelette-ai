# AI小说生成器 - Vercel全栈部署方案

## 架构概览

### 技术栈调整
- **前端**: React + TypeScript → Vercel静态部署
- **后端**: Python Flask → Vercel Serverless Functions (Python Runtime)
- **数据库**: PostgreSQL → Vercel Postgres (Neon)
- **缓存**: Redis → Vercel KV (Upstash Redis)
- **任务队列**: Celery → Vercel Cron Jobs + Inngest
- **文件存储**: AWS S3 → Vercel Blob Storage
- **域名**: Vercel自定义域名
- **CI/CD**: Vercel Git集成

## 架构图

```mermaid
graph TB
    subgraph "Vercel Edge Network"
        Edge[Edge Functions]
        Static[Static Assets]
    end
    
    subgraph "Vercel Services"
        Frontend[Next.js Frontend]
        API[Serverless Functions]
        KV[Vercel KV]
        PG[Vercel Postgres]
        Blob[Vercel Blob]
    end
    
    subgraph "外部服务"
        OpenAI[OpenAI API]
        Clerk[Clerk Auth]
    end
    
    User --> Edge
    Edge --> Frontend
    Edge --> API
    
    Frontend --> API
    API --> PG
    API --> KV
    API --> Blob
    API --> OpenAI
    
    Frontend --> Clerk
```

## 项目结构

```
ai-novel-generator/
├── frontend/          # Next.js前端
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
├── api/              # Vercel Serverless Functions
│   ├── auth/
│   ├── novels/
│   ├── chapters/
│   └── generate/
├── lib/              # 共享库
├── prisma/           # 数据库schema
├── vercel.json       # Vercel配置
└── package.json
```

## 数据库迁移

### 1. Prisma Schema
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  novels    Novel[]
}

model Novel {
  id          String   @id @default(cuid())
  title       String
  genre       String
  description String?
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user     User      @relation(fields: [userId], references: [id])
  chapters Chapter[]
}

model Chapter {
  id           String   @id @default(cuid())
  novelId      String
  chapterNumber Int
  title        String
  summary      String?
  content      String?
  status       String   @default("pending")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  novel Novel @relation(fields: [novelId], references: [id])
}
```

### 2. 迁移命令
```bash
npx prisma migrate dev --name init
npx prisma generate
```

## 前端配置 (Next.js)

### 1. Package.json
```json
{
  "name": "ai-novel-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "@prisma/client": "^5.0.0",
    "@clerk/nextjs": "^4.0.0",
    "swr": "^2.0.0",
    "tailwindcss": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5",
    "eslint": "^8",
    "eslint-config-next": "14.0.0"
  }
}
```

### 2. Vercel配置
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "DATABASE_URL": "@database-url",
    "OPENAI_API_KEY": "@openai-api-key",
    "CLERK_SECRET_KEY": "@clerk-secret-key"
  }
}
```

## 后端API (Serverless Functions)

### 1. API路由结构
```
api/
├── auth/
│   └── [...nextauth].ts
├── novels/
│   ├── index.ts          # GET, POST
│   └── [id].ts           # GET, PUT, DELETE
├── chapters/
│   ├── index.ts          # GET, POST
│   ├── [id].ts           # GET, PUT, DELETE
│   └── [id]/generate.ts  # POST
└── webhooks/
    └── stripe.ts
```

### 2. 示例API端点
```typescript
// api/novels/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const novels = await prisma.novel.findMany({
      include: { chapters: true }
    })
    res.json(novels)
  }
  
  if (req.method === 'POST') {
    const { title, genre, description } = req.body
    const novel = await prisma.novel.create({
      data: { title, genre, description, userId: req.user.id }
    })
    res.json(novel)
  }
}
```

## 环境变量配置

### 1. 开发环境 (.env.local)
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_novel"

# OpenAI
OPENAI_API_KEY="sk-your-key"

# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# KV
KV_URL="redis://..."
KV_REST_API_URL="..."
KV_REST_API_TOKEN="..."
KV_REST_API_READ_ONLY_TOKEN="..."
```

### 2. 生产环境 (Vercel Dashboard)
在Vercel Dashboard中配置：
- DATABASE_URL: Vercel Postgres连接字符串
- OPENAI_API_KEY: OpenAI API密钥
- CLERK_SECRET_KEY: Clerk认证密钥
- KV_REST_API_URL: Vercel KV连接
- BLOB_READ_WRITE_TOKEN: Vercel Blob存储令牌

## 部署命令

### 1. 初始化项目
```bash
# 安装依赖
npm install

# 设置数据库
npx prisma generate
npx prisma db push

# 本地开发
npm run dev
```

### 2. 部署到Vercel
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod

# 或者使用Git集成
git push origin main
```

## 功能映射表

| 原功能 | Vercel方案 |
|--------|------------|
| Flask API | Next.js API Routes |
| Celery任务队列 | Vercel Cron Jobs + Inngest |
| Redis缓存 | Vercel KV |
| PostgreSQL | Vercel Postgres |
| AWS S3 | Vercel Blob |
| JWT认证 | Clerk |
| Docker容器 | Serverless Functions |

## 成本估算

### Vercel定价
- **Hobby (免费)**: 适合开发测试
  - 500MB数据库
  - 100GB带宽
  - 100GB blob存储
- **Pro ($20/月)**: 生产环境
  - 1GB数据库
  - 1TB带宽
  - 500GB blob存储

### 第三方服务
- **OpenAI**: 按使用量计费
- **Clerk**: 免费10000MAU，超出$0.02/MAU

## 迁移步骤

1. **项目初始化**
   - 创建Next.js项目
   - 配置Prisma和数据库
   - 设置Clerk认证

2. **功能迁移**
   - 迁移API端点
   - 更新前端组件
   - 配置环境变量

3. **测试验证**
   - 本地测试
   - 预览环境测试
   - 生产环境部署

4. **监控配置**
   - Vercel Analytics
   - 错误追踪
   - 性能监控