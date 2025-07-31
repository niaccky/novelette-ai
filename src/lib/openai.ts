import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

// 配置OpenAI客户端，支持第三方API
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
})

// 从环境变量获取模型配置
export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4'

// AI生成小说章节的主要函数
export async function generateChapterContent(
  summary: string,
  genre: string,
  style: string,
  chapterNumber: number,
  novelTitle: string,
  previousContent?: string
): Promise<string> {
  try {
    const systemPrompt = `你是一个专业的小说作家AI助手。你的任务是根据给定的章节概要生成高质量的小说内容。

要求:
1. 风格: ${style}
2. 类型: ${genre}
3. 章节号: ${chapterNumber}
4. 小说标题: ${novelTitle}
5. 内容要求: 生成2000-3000字的章节内容
6. 保持与前文的连贯性
7. 使用生动的描写和对话
8. 符合${genre}类型小说的特点

请直接返回章节内容，不要包含额外的说明或格式。`

    const userPrompt = `章节概要: ${summary}

${previousContent ? `前文摘要: ${previousContent.slice(-500)}...` : ''}

请根据以上信息生成第${chapterNumber}章的内容。`

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 4000,
      temperature: 0.8,
    })

    return completion.choices[0]?.message?.content || '生成失败，请重试。'
  } catch (error) {
    console.error('OpenAI API错误:', error)
    throw new Error('AI生成失败，请检查API配置或稍后重试。')
  }
}

// 内容质量优化
export async function improveContent(content: string, genre: string): Promise<string> {
  try {
    const systemPrompt = `你是一个专业的文学编辑。请优化以下${genre}类型小说的内容，提升文字质量、情节连贯性和可读性。

优化要求:
1. 保持原有情节和人物设定
2. 改善文字表达和描写
3. 增强对话的自然度
4. 优化段落结构
5. 确保情节逻辑合理

请直接返回优化后的内容。`

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: content },
      ],
      max_tokens: 4000,
      temperature: 0.3,
    })

    return completion.choices[0]?.message?.content || content
  } catch (error) {
    console.error('内容优化错误:', error)
    return content
  }
}