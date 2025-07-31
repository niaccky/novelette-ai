import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const NOVEL_GENRES = [
  { value: 'fantasy', label: '玄幻' },
  { value: 'romance', label: '言情' },
  { value: 'urban', label: '都市' },
  { value: 'history', label: '历史' },
  { value: 'scifi', label: '科幻' },
  { value: 'martial-arts', label: '武侠' },
  { value: 'mystery', label: '悬疑' },
  { value: 'youth', label: '青春' },
] as const

export const NOVEL_STYLES = [
  { value: 'modern', label: '现代简约' },
  { value: 'classical', label: '古典优雅' },
  { value: 'humorous', label: '幽默轻松' },
  { value: 'dramatic', label: '戏剧化' },
  { value: 'poetic', label: '诗意抒情' },
] as const

export const CHAPTER_STATUS = {
  PENDING: 'pending',
  GENERATING: 'generating',
  COMPLETED: 'completed',
  ERROR: 'error',
} as const

export const GENERATION_TASK_TYPES = {
  CONTENT_ANALYSIS: 'content_analysis',
  STYLE_ADAPTATION: 'style_adaptation',
  CHAPTER_GENERATION: 'chapter_generation',
  QUALITY_REVIEW: 'quality_review',
} as const