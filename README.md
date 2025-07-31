# AI小说生成器

一个基于Next.js 14和OpenAI GPT-4的智能小说创作平台，让用户通过输入章节概要，选择小说类型，AI自动生成符合要求的小说章节。

## 功能特色

- 🤖 **AI驱动创作**: 基于OpenAI GPT-4的智能内容生成
- 📚 **多种类型支持**: 玄幻、言情、都市、历史、科幻等多种小说类型
- 🎨 **多样化风格**: 现代简约、古典优雅、幽默轻松等写作风格
- 📝 **实时编辑**: 支持在线编辑和预览章节内容
- 💾 **自动保存**: 智能保存功能，确保创作不丢失
- 🔐 **安全认证**: 基于Clerk的安全用户认证系统
- 📱 **响应式设计**: 完美适配各种设备尺寸

## 技术栈

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes (Serverless Functions)
- **数据库**: PostgreSQL (Vercel Postgres)
- **AI模型**: OpenAI GPT-4 API
- **认证**: Clerk
- **部署**: Vercel (全托管)
- **状态管理**: SWR
- **UI组件**: Radix UI + Tailwind CSS

## 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 数据库
- OpenAI API Key
- Clerk 账号

### 本地开发

1. **克隆项目**
```bash
git clone <项目地址>
cd ai-novel-generator
```

2. **安装依赖**
```bash
npm install
```

3. **环境变量配置**
创建 `.env.local` 文件并填写相应的环境变量：

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_novel"

# OpenAI Configuration (支持第三方API)
OPENAI_API_KEY="sk-your-openai-api-key"
OPENAI_BASE_URL="https://api.openai.com/v1"  # 可选，默认为OpenAI官方API
OPENAI_MODEL="gpt-4"  # 可选，默认为gpt-4

# 第三方API配置示例:
# DeepSeek API
# OPENAI_BASE_URL="https://api.deepseek.com/v1"
# OPENAI_MODEL="deepseek-chat"

# 智谱AI
# OPENAI_BASE_URL="https://open.bigmodel.cn/api/paas/v4"
# OPENAI_MODEL="glm-4"

# 其他兼容OpenAI API的服务
# OPENAI_BASE_URL="https://your-api-provider.com/v1"
# OPENAI_MODEL="your-model-name"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your-publishable-key"
CLERK_SECRET_KEY="sk_test_your-secret-key"
```

4. **数据库初始化**
```bash
npx prisma generate
npx prisma db push
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 开始使用。

## 部署到Vercel

### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ai-novel-generator)

### 手动部署

1. **安装Vercel CLI**
```bash
npm i -g vercel
```

2. **登录Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
vercel --prod
```

4. **配置环境变量**
在Vercel Dashboard中配置以下环境变量：
- `DATABASE_URL`: PostgreSQL连接字符串
- `OPENAI_API_KEY`: OpenAI API密钥
- `CLERK_SECRET_KEY`: Clerk密钥
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk公钥

5. **设置数据库**
```bash
npx prisma generate
npx prisma db push
```

## 项目结构

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API路由
│   ├── dashboard/         # 仪表板页面
│   ├── novels/           # 小说详情页面
│   ├── chapters/         # 章节页面
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 首页
├── components/            # React组件
│   ├── ui/               # 基础UI组件
│   ├── NovelList.tsx     # 小说列表
│   ├── ChapterEditor.tsx # 章节编辑器
│   └── ...
├── lib/                  # 工具库
│   ├── prisma.ts         # 数据库客户端
│   ├── openai.ts         # OpenAI客户端
│   └── utils.ts          # 工具函数
└── middleware.ts         # 中间件

prisma/
└── schema.prisma         # 数据库模式
```

## API文档

### 小说管理

- `GET /api/novels` - 获取用户所有小说
- `POST /api/novels` - 创建新小说
- `GET /api/novels/:id` - 获取指定小说详情
- `PUT /api/novels/:id` - 更新小说信息
- `DELETE /api/novels/:id` - 删除小说

### 章节管理

- `POST /api/chapters` - 创建新章节
- `GET /api/chapters/:id` - 获取章节详情
- `PUT /api/chapters/:id` - 更新章节内容
- `DELETE /api/chapters/:id` - 删除章节
- `POST /api/chapters/:id/generate` - 生成章节内容

## 使用指南

### 创建小说

1. 登录后进入仪表板
2. 点击"创建小说"按钮
3. 填写小说标题、选择类型和风格
4. 添加小说简介（可选）
5. 点击"创建小说"完成

### 添加章节

1. 进入小说详情页
2. 点击"添加章节"按钮
3. 填写章节标题和概要
4. 点击"创建章节"

### 生成内容

1. 进入章节编辑页面
2. 确保已填写章节概要
3. 点击"生成内容"按钮
4. 等待AI生成完成
5. 可以直接编辑生成的内容
6. 点击"保存"保存修改

## 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

1. Fork本项目
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个Pull Request

## 许可证

本项目基于MIT许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 支持

如果您觉得这个项目有用，请给它一个⭐️!

如有问题或建议，请提交Issue或发送邮件至：support@example.com