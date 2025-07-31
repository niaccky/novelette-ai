/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
  },
  images: {
    domains: ['img.clerk.com'],
  },
}

module.exports = nextConfig