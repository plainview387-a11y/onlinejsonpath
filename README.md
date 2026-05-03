# OnlineJsonPath / 在线工具集

一个基于 Next.js App Router 的在线工具站，当前包含 JSONPath、Base64、时间戳、JSON 转义、文本统计、图片 Base64、IP 查询、Java 转 Node.js 等常用开发工具，并集成了作品展示页与评论能力。

## 技术栈

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Supabase（可选，用于用户/评论）

## 开发环境

要求：
- Node.js 20+
- pnpm 9+

安装依赖：

```bash
pnpm install
```

启动开发环境：

```bash
pnpm dev
```

默认地址：

- <http://localhost:5000>

## 生产构建

```bash
pnpm build
pnpm start
```

## 质量检查

```bash
pnpm lint
pnpm ts-check
```

## 环境变量

复制 `.env.example` 后按需填写：

```bash
cp .env.example .env.local
```

关键变量：

- `JWT_SECRET`：必填，用于登录态和验证码 token 签名
- `COZE_SUPABASE_URL` / `COZE_SUPABASE_ANON_KEY`：可选，启用 Supabase 时使用
- `DATABASE_URL`：如需使用 Drizzle / PostgreSQL 能力时配置
- `ADMIN_EMAILS`：可选，逗号分隔的管理员邮箱列表

> 注意：生产环境不要使用弱密钥或占位值。

## 功能说明

### 在线工具

- JSONPath 解析
- Base64 加解密
- 时间戳转换
- JSON 转义 / 反转义
- 文本统计
- 图片 Base64 互转
- IP 查询
- Java 转 Node.js

### 作品页

- `/projects/ai-project`
- 用于展示候选人简介、项目经历、简历下载与联系方式

### 用户与评论

当配置 Supabase 时：
- 支持注册 / 登录
- 支持工具页评论与回复

未配置 Supabase 时：
- 项目会回退到本地演示模式
- 适合本地预览，但不建议作为正式线上用户系统

## 项目结构

```text
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── projects/
│   ├── tools/
│   └── api/
├── components/
├── contexts/
├── lib/
└── storage/
```

## 当前优化方向

- 工具页 SEO 与 metadata 完善
- 评论体验与管理能力优化
- 工程脚本与配置去模板化
- 作品页内容与公开信息收口
