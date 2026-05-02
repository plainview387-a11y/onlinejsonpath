import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AIProject 在线简历与项目展示页',
  description:
    'AIProject 页面用于展示个人简历、项目经历、技能结构和联系信息，适合在线作品集、求职展示和项目介绍。',
  keywords: ['在线简历', '项目作品集', '前端简历', 'AIProject'],
  alternates: {
    canonical: '/projects/ai-project',
  },
};

export default function AIProjectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
