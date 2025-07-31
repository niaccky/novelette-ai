# AI小说生成网站实施计划 (Vercel版本)

## 项目概述
构建一个基于Agent的AI小说生成网站，用户通过输入章节概要，选择小说类型，AI自动生成符合要求的小说章节。

## 技术栈 (Vercel版本)
- **后端**: Next.js API Routes (Serverless Functions)
- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **数据库**: Vercel Postgres (Neon)
- **AI模型**: OpenAI GPT-4 API
- **任务队列**: Vercel Cron Jobs + Inngest
- **部署**: Vercel (全托管)
- **认证**: Clerk
- **缓存**: Vercel KV (Upstash Redis)
- **文件存储**: Vercel Blob

## 系统架构 (Vercel版本)

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

## 核心功能模块

### 1. 用户管理模块
- 用户注册/登录 (Clerk认证)
- 社交登录支持
- 用户偏好设置

### 2. 小说项目管理
- 创建小说项目
- 设置小说类型和风格
- 管理章节结构

### 3. AI生成引擎
- 章节内容生成Agent
- 类型风格适配Agent
- 质量优化Agent

### 4. 任务管理
- 异步生成任务 (Vercel Cron Jobs)
- 实时进度跟踪
- 失败重试机制

## 数据库设计 (Prisma Schema)

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
  id            String   @id @default(cuid())
  novelId       String
  chapterNumber Int
  title         String
  summary       String?
  content       String?
  status        String   @default("pending")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  novel Novel @relation(fields: [novelId], references: [id])
}
```

## API设计 (Next.js API Routes)

### 核心API端点
```
GET    /api/novels
POST   /api/novels
GET    /api/novels/:id
PUT    /api/novels/:id
DELETE /api/novels/:id

GET    /api/chapters
POST   /api/chapters
GET    /api/chapters/:id
PUT    /api/chapters/:id
DELETE /api/chapters/:id
POST   /api/chapters/:id/generate
GET    /api/chapters/:id/status
```

## 前端界面设计 (Next.js 14)

### 主要页面
1. **首页** - 项目展示和介绍
2. **登录/注册页** - Clerk认证
3. **仪表板** - 项目列表概览
4. **项目详情页** - 管理小说项目
5. **章节编辑页** - 编辑和生成内容
6. **生成进度页** - 实时跟踪AI生成

### 组件结构
```
src/
├── app/
│   ├── api/
│   ├── novels/
│   ├── chapters/
│   └── globals.css
├── components/
│   ├── ui/
│   ├── NovelCard/
│   ├── ChapterEditor/
│   └── GenerationProgress/
├── lib/
│   ├── prisma.ts
│   ├── openai.ts
│   └── utils.ts
└── middleware.ts
```

## 开发里程碑 (Vercel版本)

### 第一阶段 (1周): 项目初始化
- [x] 技术栈确认 (Vercel方案)
- [x] 数据库设计 (Prisma)
- [ ] 项目初始化 (Next.js)
- [ ] 环境配置 (Vercel)
- [ ] 认证集成 (Clerk)

### 第二阶段 (1.5周): 核心功能
- [ ] 数据库模型实现
- [ ] 用户认证系统
- [ ] 小说CRUD API
- [ ] 章节管理API
- [ ] 基础前端界面

### 第三阶段 (1.5周): AI集成
- [ ] OpenAI API集成
- [ ] 章节生成功能
- [ ] 异步任务处理
- [ ] 进度跟踪
- [ ] 前端界面完善

### 第四阶段 (1周): 部署和优化
- [ ] 性能优化
- [ ] 错误处理
- [ ] 测试覆盖
- [ ] 生产环境部署

## 项目初始化命令 (Vercel版本)

```bash
# 创建项目
npx create-next-app@latest ai-novel-vercel --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd ai-novel-vercel

# 安装依赖
npm install @prisma/client prisma @clerk/nextjs swr
npm install -D @types/node @types/react @types/react-dom

# 初始化Prisma
npx prisma init

# 设置环境变量
cp .env.example .env.local

# 启动开发
npm run dev
```

## 环境变量配置 (Vercel版本)

### 开发环境 (.env.local)
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
```

### 生产环境 (Vercel Dashboard)
- DATABASE_URL: Vercel Postgres连接字符串
- OPENAI_API_KEY: OpenAI API密钥
- CLERK_SECRET_KEY: Clerk认证密钥
- KV_REST_API_URL: Vercel KV连接
- BLOB_READ_WRITE_TOKEN: Vercel Blob存储令牌

## 部署策略 (Vercel版本)

### 开发环境
```bash
npm run dev
```

### 生产环境
- **平台**: Vercel (全托管Serverless)
- **部署**: 自动Git集成 + CI/CD
- **域名**: Vercel域名或自定义域名
- **监控**: Vercel Analytics + 错误追踪

### 部署步骤
1. **项目初始化**: `npx create-next-app@latest`
2. **环境配置**: 在Vercel Dashboard设置环境变量
3. **数据库**: 使用Vercel Postgres
4. **认证**: 集成Clerk
5. **部署**: `git push origin main` 自动部署

## 成本估算 (Vercel版本)

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
- **OpenAI**: 按使用量计费 (~$0.002/1K tokens)
- **Clerk**: 免费10000MAU，超出$0.02/MAU

## 风险评估和缓解

### 技术风险
- **无服务器限制**: 函数执行时间限制 (Vercel: 30s)
- **冷启动延迟**: 首次访问稍慢
- **供应商锁定**: 依赖Vercel生态系统

### 缓解措施
- **性能优化**: 使用Edge Functions减少冷启动
- **架构设计**: 保持可移植性，减少供应商依赖
- **监控**: Vercel Analytics + 自定义监控

## 下一步行动计划 (更新)

1. **立即开始**: 项目初始化和环境配置
2. **本周内**: 完成数据库设计和基础API
3. **两周内**: 核心功能开发完成
4. **三周内**: 生产环境部署上线

## 项目状态
- ✅ 技术方案确认: Vercel全栈方案
- ✅ 架构设计完成
- ✅ 部署策略制定
- 🔄 准备开始开发实施