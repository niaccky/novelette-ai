# 环境变量配置说明

## 基础环境变量

创建 `.env.local` 文件，配置以下环境变量：

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_novel"

# OpenAI Configuration (支持第三方API)
OPENAI_API_KEY="sk-your-openai-api-key"
OPENAI_BASE_URL="https://api.openai.com/v1"  # 可选，默认为OpenAI官方API
OPENAI_MODEL="gpt-4"  # 可选，默认为gpt-4

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your-publishable-key"
CLERK_SECRET_KEY="sk_test_your-secret-key"
```

## 第三方API配置示例

### DeepSeek API
```bash
OPENAI_API_KEY="sk-your-deepseek-api-key"
OPENAI_BASE_URL="https://api.deepseek.com/v1"
OPENAI_MODEL="deepseek-chat"
```

### 智谱AI (GLM)
```bash
OPENAI_API_KEY="your-zhipu-api-key"
OPENAI_BASE_URL="https://open.bigmodel.cn/api/paas/v4"
OPENAI_MODEL="glm-4"
```

### 阿里云通义千问
```bash
OPENAI_API_KEY="sk-your-qwen-api-key"
OPENAI_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
OPENAI_MODEL="qwen-turbo"
```

### 其他兼容OpenAI API的服务
```bash
OPENAI_API_KEY="your-api-key"
OPENAI_BASE_URL="https://your-api-provider.com/v1"
OPENAI_MODEL="your-model-name"
```

## 可选配置

```bash
# Vercel KV (Optional - for caching)
KV_URL="redis://..."
KV_REST_API_URL="..."
KV_REST_API_TOKEN="..."

# Vercel Blob (Optional - for file storage)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

## 注意事项

1. **API Key**: 确保您的API密钥有足够的额度和权限
2. **Base URL**: 不同的服务商使用不同的API端点
3. **模型名称**: 确保指定的模型在您选择的服务商中可用
4. **兼容性**: 大部分支持OpenAI API格式的服务都可以直接使用