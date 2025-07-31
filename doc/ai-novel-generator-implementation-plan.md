# AI小说生成网站实施计划

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

## 系统架构

```mermaid
graph TB
    subgraph "前端层"
        UI[React前端]
    end
    
    subgraph "API网关"
        Gateway[Flask API]
    end
    
    subgraph "业务服务层"
        Auth[认证服务]
        Novel[小说服务]
        Agent[Agent编排]
        Queue[任务队列]
    end
    
    subgraph "AI能力层"
        GPT[OpenAI GPT]
        Claude[Claude API]
        Prompt[提示词管理]
    end
    
    subgraph "数据存储"
        PG[(PostgreSQL)]
        Redis[(Redis缓存)]
        S3[文件存储]
    end
    
    UI --> Gateway
    Gateway --> Auth
    Gateway --> Novel
    Novel --> Agent
    Agent --> Queue
    Queue --> GPT
    Queue --> Claude
    Novel --> PG
    Agent --> Prompt
    Redis --> Queue
    S3 --> Novel
```

## 核心功能模块

### 1. 用户管理模块
- 用户注册/登录
- JWT认证
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
- 异步生成任务
- 实时进度跟踪
- 失败重试机制

## Agent系统设计

### 主Agent: NovelGenerationAgent
负责协调整个小说生成流程

### 子Agent分工
1. **ContentAnalysisAgent**: 分析用户输入概要
2. **StyleAdapterAgent**: 根据小说类型调整文风
3. **ChapterGenerationAgent**: 生成具体章节内容
4. **QualityReviewAgent**: 质量检查和优化
5. **ContinuityAgent**: 确保章节连贯性

## 数据库设计

### 核心表结构
```sql
-- 用户表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 小说项目表
CREATE TABLE novel_projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    description TEXT,
    style_preferences JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 章节表
CREATE TABLE chapters (
    id SERIAL PRIMARY KEY,
    novel_id INTEGER REFERENCES novel_projects(id),
    chapter_number INTEGER NOT NULL,
    title VARCHAR(200),
    summary TEXT,
    content TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 生成任务表
CREATE TABLE generation_tasks (
    id SERIAL PRIMARY KEY,
    chapter_id INTEGER REFERENCES chapters(id),
    task_type VARCHAR(50),
    parameters JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    result TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## API设计

### 核心API端点
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/novels
POST   /api/novels
GET    /api/novels/:id
POST   /api/novels/:id/chapters
POST   /api/chapters/:id/generate
GET    /api/chapters/:id/status
PUT    /api/chapters/:id/content
```

## 前端界面设计

### 主要页面
1. **登录/注册页**
2. **项目列表页**
3. **项目详情页**
4. **章节编辑页**
5. **生成进度页**

### 组件结构
```
src/
├── components/
│   ├── NovelCard/
│   ├── ChapterEditor/
│   ├── GenerationProgress/
│   └── TypeSelector/
├── pages/
├── services/
└── hooks/
```

## 开发里程碑

### 第一阶段 (2周): 基础框架
- [ ] 项目初始化和配置
- [ ] 数据库设计和初始化
- [ ] 用户认证系统
- [ ] 基础API开发
- [ ] 简单前端界面

### 第二阶段 (2周): 核心功能
- [ ] AI集成和测试
- [ ] Agent系统实现
- [ ] 小说生成功能
- [ ] 任务队列配置
- [ ] 前端界面完善

### 第三阶段 (1周): 优化和部署
- [ ] 性能优化
- [ ] 错误处理
- [ ] 测试覆盖
- [ ] 生产环境部署

## 项目初始化命令

```bash
# 创建项目目录
mkdir ai-novel-generator
cd ai-novel-generator

# 后端初始化
mkdir backend
cd backend
python -m venv venv
source venv/bin/activate
pip install flask flask-sqlalchemy flask-jwt-extended celery redis openai python-dotenv

# 前端初始化
cd ..
npx create-react-app frontend --template typescript
cd frontend
npm install axios @types/react @types/react-dom react-router-dom
```

## 环境变量配置

### 后端 (.env)
```
DATABASE_URL=postgresql://user:password@localhost/ai_novel
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=your_openai_key
SECRET_KEY=your_secret_key
```

### 前端 (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 部署策略 (Vercel方案)

### 开发环境
```bash
# 一键启动
npm run dev
```

### 生产环境
- **平台**: Vercel (全托管Serverless)
- **部署**: 自动Git集成 + CI/CD
- **域名**: Vercel域名或自定义域名
- **监控**: Vercel Analytics + 错误追踪

### Vercel部署步骤
1. **项目初始化**: `npx create-next-app@latest`
2. **环境配置**: 在Vercel Dashboard设置环境变量
3. **数据库**: 使用Vercel Postgres
4. **认证**: 集成Clerk
5. **部署**: `git push origin main` 自动部署

### 成本优化
- **免费层**: 适合开发和测试
- **Pro计划**: $20/月，适合生产环境
- **按需付费**: 无服务器架构，仅按使用付费

## 下一步行动计划
1. 确认需求细节
2. 开始第一阶段开发
3. 设置开发环境
4. 创建Git仓库
5. 开始编码实现

## 风险评估
- AI API调用成本
- 生成内容质量控制
- 系统扩展性
- 用户体验优化