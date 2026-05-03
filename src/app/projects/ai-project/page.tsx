import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Download,
  ExternalLink,
  Mail,
  MapPin,
  Sparkles,
  Workflow,
  Compass,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { profile } from '@/lib/portfolio';

export const metadata: Metadata = {
  title: 'AIProject Portfolio / Resume',
  description:
    'A public portfolio page that presents project experience, skills, and capability overview for frontend and full-stack work.',
  keywords: ['frontend portfolio', 'full-stack', 'resume', 'projects', 'developer profile'],
  alternates: {
    canonical: '/projects/ai-project',
  },
  openGraph: {
    title: 'AIProject Portfolio / Resume',
    description: 'Project experience, skill structure, and public capability overview.',
    url: 'https://onlinejsonpath.vercel.app/projects/ai-project',
    type: 'profile',
  },
};

const highlights = [
  { labelZh: '项目方向', labelEn: 'Project focus', valueZh: '管理系统 / 小程序 / 门户', valueEn: 'Admin systems / Mini apps / Portals', icon: Workflow },
  { labelZh: '技术特征', labelEn: 'Tech focus', valueZh: 'Vue / TS / 工程化', valueEn: 'Vue / TS / Engineering', icon: Sparkles },
  { labelZh: '工作方式', labelEn: 'Work style', valueZh: '需求到上线', valueEn: 'From requirement to delivery', icon: Compass },
];

const aboutItems = [
  {
    titleZh: '我擅长的方向',
    titleEn: 'What I focus on',
    textZh: '我更擅长前端开发、后台管理系统、小程序和门户类项目，也能够配合接口、权限模型和数据展示场景完成整套功能落地。',
    textEn: 'My strengths are frontend development, admin systems, mini apps, and portal-style projects, with solid delivery ability across APIs, permission models, and data display scenarios.',
  },
  {
    titleZh: '我重视的结果',
    titleEn: 'What I care about',
    textZh: '相比只完成页面，我更在意交互是否清晰、结构是否稳定、系统是否易于维护，以及功能上线后能否继续扩展。',
    textEn: 'Beyond page completion, I care about clarity, stability, maintainability, and whether the system can continue to scale after launch.',
  },
  {
    titleZh: '我希望带来的价值',
    titleEn: 'Value I aim to bring',
    textZh: '把复杂需求拆清楚，把功能做稳定，把使用路径做顺，让系统既能上线，也能长期用得住。',
    textEn: 'I aim to break down complex requirements, make features stable, and keep usage paths smooth so a system can launch well and remain useful long term.',
  },
];

const posts = [
  {
    titleZh: '权限模型应该尽早想清楚',
    titleEn: 'Permission models should be designed early',
    categoryZh: '系统设计',
    categoryEn: 'System Design',
    date: '2026-04-18',
    excerptZh: '后台系统里的角色、按钮和接口权限如果前期没有梳理清楚，后期补起来成本会明显变高。',
    excerptEn: 'If roles, button permissions, and API permissions are not defined early in an admin system, the cost of patching them later rises sharply.',
  },
  {
    titleZh: '小程序性能优化通常比继续堆功能更重要',
    titleEn: 'Mini app performance often matters more than adding more features',
    categoryZh: '性能优化',
    categoryEn: 'Performance',
    date: '2026-04-05',
    excerptZh: '当商品、图片和列表数据持续增加之后，加载速度和渲染体验会直接影响业务效果。',
    excerptEn: 'As product, image, and list data keep growing, load speed and rendering quality directly affect business outcomes.',
  },
];

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">{description}</p>
    </div>
  );
}

export default function AIProjectPage() {
  const isZh = true;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:px-8 md:py-14 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="flex flex-col pt-4 md:pt-6 lg:pt-10">
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-sm">
            {isZh ? '在线简历 / 项目作品 / 求职展示' : 'Resume / Projects / Public Portfolio'}
          </Badge>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            {isZh ? '你好，这里是我的项目与能力展示' : 'Hello, this is my project and capability showcase'}
          </h1>
          <p className="mt-4 text-xl font-medium text-primary md:text-2xl">{profile.role}</p>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-muted-foreground">{profile.tagline}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full rounded-full sm:w-auto">
              <a href="#projects"><BriefcaseBusiness className="mr-2 h-4 w-4" />{isZh ? '看项目' : 'View Projects'}</a>
            </Button>
            <Button size="lg" variant="outline" className="w-full rounded-full sm:w-auto" disabled>
              <Download className="mr-2 h-4 w-4" />{isZh ? '简历暂不公开' : 'Resume not public'}
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full rounded-full sm:w-auto">
              <a href="#contact"><Mail className="mr-2 h-4 w-4" />{isZh ? '联系方式说明' : 'Contact Notes'}</a>
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Card><CardContent className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{isZh ? '当前状态' : 'Current status'}</p><p className="mt-2 text-sm leading-7">{profile.status}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{isZh ? '合作方向' : 'Availability'}</p><p className="mt-2 text-sm leading-7">{profile.availability}</p></CardContent></Card>
          </div>
        </div>

        <Card className="relative overflow-hidden border-primary/20 shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.12),transparent_22%),linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(248,250,252,1)_42%,rgba(239,246,255,1)_100%)]" />
          <CardContent className="relative p-5 sm:p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <Badge variant="outline" className="rounded-full bg-background/80">Public / Project / Capability</Badge>
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-sm">{profile.avatarInitials}</div>
            </div>
            <div className="mt-6 space-y-4">
              <Card className="border-0 bg-primary text-primary-foreground shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">What I do</p>
                      <h3 className="mt-2 text-2xl font-semibold leading-tight">{isZh ? '把复杂流程变成更直观的产品' : 'Turn complex workflows into intuitive products'}</h3>
                    </div>
                    <Sparkles className="mt-1 h-5 w-5 shrink-0" />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-primary-foreground/85">{isZh ? '我更偏向参与真实业务场景中的系统建设，关注交付质量、维护成本和长期可用性。' : 'I prefer building systems for real business scenarios, with attention to delivery quality, maintenance cost, and long-term usability.'}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;
          return <Card key={item.labelZh} className="shadow-sm transition hover:-translate-y-1 hover:shadow-md"><CardContent className="p-5"><Icon className="h-5 w-5 text-primary" /><p className="mt-5 text-3xl font-semibold">{isZh ? item.valueZh : item.valueEn}</p><p className="mt-1 text-sm text-muted-foreground">{isZh ? item.labelZh : item.labelEn}</p></CardContent></Card>;
        })}
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <SectionHeading eyebrow="About" title={isZh ? '我希望做出什么样的产品' : 'What kind of products I aim to build'} description={profile.intro} />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {aboutItems.map((item) => <Card key={item.titleZh} className="shadow-sm"><CardContent className="p-6"><h3 className="text-lg font-semibold">{isZh ? item.titleZh : item.titleEn}</h3><p className="mt-3 leading-8 text-muted-foreground">{isZh ? item.textZh : item.textEn}</p></CardContent></Card>)}
        </div>
      </section>

      <section id="blog" className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <SectionHeading eyebrow="Writing" title={isZh ? '补充说明' : 'Additional Notes'} description={isZh ? '以下内容用于补充说明我关注的问题类型、做事方式和项目判断标准。' : 'These notes further explain the kinds of problems I care about, how I work, and how I evaluate projects.'} />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {posts.map((post) => <Card key={post.titleZh} className="shadow-sm"><CardContent className="p-6"><div className="flex items-center justify-between gap-4 text-sm text-muted-foreground"><Badge variant="secondary" className="rounded-full">{isZh ? post.categoryZh : post.categoryEn}</Badge><span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />{post.date}</span></div><h3 className="mt-5 text-lg font-semibold leading-7">{isZh ? post.titleZh : post.titleEn}</h3><p className="mt-3 leading-7 text-muted-foreground">{isZh ? post.excerptZh : post.excerptEn}</p></CardContent></Card>)}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <Card className="overflow-hidden bg-primary text-primary-foreground shadow-sm">
          <CardContent className="p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">Contact</p>
                <h2 className="mt-3 text-3xl font-semibold">{isZh ? '如果你正在寻找偏系统实现和业务落地的前端 / 全栈同学，这里可以先看项目与能力概览' : 'If you are looking for a frontend or full-stack developer focused on systems and delivery, this page serves as an initial capability overview.'}</h2>
                <p className="mt-4 leading-8 text-primary-foreground/80">{isZh ? '当前为公开展示版，个人联系方式与完整简历暂不在页面直接公开。' : 'This is a public version. Personal contact details and the full resume are not directly shown on the page.'}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/15 bg-white/10 p-4"><MapPin className="h-5 w-5" /><span className="mt-4 block text-sm text-primary-foreground/70">{isZh ? '所在地' : 'Location'}</span><span className="mt-1 flex items-center gap-2 font-semibold">{profile.location}</span></div>
                <div className="rounded-[24px] border border-white/15 bg-white/10 p-4"><Mail className="h-5 w-5" /><span className="mt-4 block text-sm text-primary-foreground/70">{isZh ? '联系说明' : 'Contact Note'}</span><span className="mt-1 flex items-center gap-2 font-semibold">{isZh ? '联系方式与完整简历按需提供' : 'Contact details and full resume are available on request'}</span></div>
                <Link href="/" className="rounded-[24px] border border-white/15 bg-white/10 p-4 transition hover:bg-white/15"><ExternalLink className="h-5 w-5" /><span className="mt-4 block text-sm text-primary-foreground/70">{isZh ? '返回工具首页' : 'Back to tools'}</span><span className="mt-1 flex items-center gap-2 font-semibold">ToolNest<ArrowUpRight className="h-4 w-4" /></span></Link>
                <div className="rounded-[24px] border border-white/15 bg-white/10 p-4"><Download className="h-5 w-5" /><span className="mt-4 block text-sm text-primary-foreground/70">PDF Resume</span><span className="mt-1 flex items-center gap-2 font-semibold">{isZh ? '暂不公开' : 'Not public'}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
