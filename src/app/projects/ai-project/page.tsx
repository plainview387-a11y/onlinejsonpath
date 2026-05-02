import Link from 'next/link';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  Mail,
  MapPin,
  Sparkles,
  Workflow,
  Code2,
  Database,
  Compass,
  Phone,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const profile = {
  name: '牛晓龙',
  role: '前端开发 / 全栈开发 / 产品实现',
  location: '上海',
  tagline:
    '擅长 Web 前端、管理系统、小程序和数据展示场景，喜欢把复杂需求做成直观、稳定、好维护的产品。',
  intro:
    '我目前更关注前端工程化、后台管理系统、微信小程序、数据展示和业务工具方向。相比单纯完成页面，我更在意交互是不是顺手、结构是不是清楚、系统是不是稳定，以及功能上线之后能不能长期维护和继续扩展。',
  email: '2719263509@qq.com',
  phone: '18155884720',
  school: '池州学院',
  major: '数据科学与大数据技术',
  resumeUrl: '/牛晓龙-2024ss-简历.pdf',
  avatarInitials: 'NX',
  status: '可交流前端 / 全栈 / 实施开发相关机会',
  availability: '期望工作地点上海，期望岗位偏实施工程师 / 前端开发 / 系统开发',
};

const highlights = [
  { label: '项目方向', value: '管理系统 / 小程序 / 门户', icon: Workflow },
  { label: '技术特征', value: 'Vue / TS / 工程化', icon: Sparkles },
  { label: '工作方式', value: '需求到上线', icon: Compass },
];

const aboutItems = [
  {
    title: '我擅长做什么',
    text: '我更擅长前端开发、后台管理系统、小程序和门户类项目，也能够配合后端接口、权限模型、数据展示等业务场景完成整套功能落地。',
  },
  {
    title: '我重视什么体验',
    text: '我希望系统不是只有功能，而是让用户一看就知道怎么用，页面加载顺畅、交互直接、结构清晰、长期也容易维护。',
  },
  {
    title: '我比较有兴趣的方向',
    text: '企业后台系统、教育平台、微信小程序、数据展示工具，以及可以和 AI 或自动化能力结合的业务型产品。',
  },
  {
    title: '我希望带来的价值',
    text: '把复杂需求拆清楚，把页面做稳定，把使用路径做顺，让一个项目不只是能上线，而且能持续用得住。',
  },
];

const skillGroups = [
  {
    title: '前端基础',
    icon: Code2,
    skills: ['HTML', 'CSS', 'JavaScript', 'ES6', 'TypeScript', 'Flex 布局'],
  },
  {
    title: '框架与生态',
    icon: Workflow,
    skills: ['Vue2', 'Vue3', 'Vue Router', 'Vuex', 'Pinia', 'uni-app'],
  },
  {
    title: '工程与工具',
    icon: Database,
    skills: ['Git', 'Webpack', 'Vite', 'Sass', 'Less', 'Node.js 基础'],
  },
  {
    title: '数据与后端配合',
    icon: BriefcaseBusiness,
    skills: ['MySQL', '接口联调', '权限控制', 'CSV 导入导出', 'ECharts', '性能优化'],
  },
];

const projects = [
  {
    name: '办鹿（uni-app）',
    summary:
      '面向 C 端用户的微信小程序，主打年轻人头像与正版周边在线销售，重点在于分享、下单、查询和客服等完整业务流程。',
    tech: ['uni-app', 'Vue3', 'Pinia', 'TypeScript'],
    role:
      '独立完成项目搭建与核心功能开发，实现微信一键登录、下单支付、商品分享、订单查询、物流查询和客服功能。',
    impact:
      '针对商品信息数据做了虚拟列表优化，提升首屏加载和渲染性能，并结合微信开放接口与第三方物流服务完成业务闭环。',
    result: '从 0 到 1 独立搭建并落地完整小程序流程，兼顾性能、功能和上线规范。',
    metric: '完成完整小程序闭环流程，并优化首页上万条数据的加载体验',
    tags: ['微信小程序', '独立开发', '性能优化'],
  },
  {
    name: '办鹿后台管理系统',
    summary:
      '基于 Vue3、Vite、Pinia、TypeScript 和 Hooks 开发的后台管理系统，覆盖商城管理、财务管理、订单处理和权限控制。',
    tech: ['Vue3', 'Vite', 'Pinia', 'TypeScript', 'Hooks', 'ECharts'],
    role:
      '负责权限控制、文件上传下载优化、打包上线优化，以及数据展示和 CSV 导入导出等功能实现。',
    impact:
      '采用 RBAC 权限模型做细粒度控制，使用分片上传优化大文件传输，并借助 webpack-bundle-analyzer、Gzip、CDN 等手段优化加载性能。',
    result: '让管理系统在权限、安全、数据处理和性能层面都更适合实际业务长期使用。',
    metric: '完成 RBAC 权限模型、文件传输优化和项目上线性能优化',
    tags: ['后台系统', 'RBAC', '工程优化'],
  },
  {
    name: '校宝 SaaS 系统-门户',
    summary:
      '面向教育培训行业的在线学习平台门户，主要提供课程播放、选课、注册登录等前台能力，并兼顾 SEO 场景。',
    tech: ['Vue2', 'Nuxt.js', '前端开发', 'SEO 优化'],
    role:
      '负责项目前端开发和维护，参与需求分析与技术选型，实现注册、登录、选课、播放等功能，并承担 Nuxt.js 服务端渲染版本开发。',
    impact:
      '通过服务端渲染提升 SEO 表现，同时在项目上线后持续修复 bug、优化体验，并和后端及客户保持高频协作。',
    result: '兼顾教育平台业务需求和搜索优化需求，让门户系统既能用也更利于获取流量。',
    metric: '完成门户功能开发与 Nuxt SSR 版本支持，提升 SEO 表现',
    tags: ['教育平台', '门户系统', 'SSR'],
  },
];

const posts = [
  {
    title: '后台系统为什么权限模型要尽早想清楚',
    category: '系统设计',
    date: '2026-04-18',
    excerpt: '权限设计如果前期没有想清楚，后面补起来会很痛苦，尤其是角色、按钮和接口级权限同时存在的时候。',
  },
  {
    title: '做小程序时，性能优化往往比功能堆砌更重要',
    category: '性能优化',
    date: '2026-04-05',
    excerpt: '当商品、图片和列表数据变多之后，加载速度和渲染体验会直接影响转化和留存。',
  },
  {
    title: '为什么我很看重页面是否足够直观',
    category: '产品思考',
    date: '2026-03-22',
    excerpt: '用户未必关心你用了什么框架，但一定会在意他能不能快速找到功能、顺利完成操作。',
  },
];

const resumeSections = [
  {
    title: '基本信息',
    items: [
      `电话：${profile.phone}`,
      `邮箱：${profile.email}`,
      `毕业院校：${profile.school}`,
      `专业：${profile.major}`,
    ],
  },
  {
    title: '教育背景',
    items: [
      '2022.09 - 2024.07 池州学院',
      '数据科学与大数据技术 / 本科',
      '主修课程：C++、Python、数据可视化、分布式系统与云计算、数据结构、数据挖掘、MySQL、网页设计、软件测试、Java、C#',
    ],
  },
  {
    title: '校园经历与证书',
    items: [
      '2022-2023 获得安徽省第九届“互联网+”校级二等奖',
      '2022-2023 获得校级三等奖学金',
      '大学英语四级',
    ],
  },
];

const contactLinks = [
  { label: '邮箱', value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
  { label: '电话', value: profile.phone, href: `tel:${profile.phone}`, icon: Phone },
  { label: '所在地', value: profile.location, href: '#', icon: MapPin },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">{description}</p>
    </div>
  );
}

export default function AIProjectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <section className="mx-auto grid max-w-7xl items-start gap-8 px-4 py-10 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:py-14">
        <div className="flex flex-col pt-6 md:pt-10">
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-sm">
            作品集 / 在线简历 / 项目展示页
          </Badge>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            你好，我是 {profile.name}
          </h1>
          <p className="mt-4 text-xl font-medium text-primary md:text-2xl">{profile.role}</p>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-muted-foreground">{profile.tagline}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full">
              <a href="#projects">
                <BriefcaseBusiness className="mr-2 h-4 w-4" />
                看项目
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <a href={profile.resumeUrl}>
                <Download className="mr-2 h-4 w-4" />
                看简历
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <a href="#contact">
                <Mail className="mr-2 h-4 w-4" />
                联系我
              </a>
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">当前状态</p>
                <p className="mt-2 text-sm leading-7">{profile.status}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">合作方向</p>
                <p className="mt-2 text-sm leading-7">{profile.availability}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="relative overflow-hidden border-primary/20 shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.12),transparent_22%),linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(248,250,252,1)_42%,rgba(239,246,255,1)_100%)]" />
          <CardContent className="relative p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <Badge variant="outline" className="rounded-full bg-background/80">
                Young / Clear / Product-minded
              </Badge>
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-sm">
                {profile.avatarInitials}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Card className="border-0 bg-primary text-primary-foreground shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">What I do</p>
                      <h3 className="mt-2 text-2xl font-semibold leading-tight">把复杂流程变成更直观的产品</h3>
                    </div>
                    <Sparkles className="mt-1 h-5 w-5 shrink-0" />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-primary-foreground/85">
                    我更喜欢做那种真正有人在用、能帮团队省时间、而且能长期维护的系统和工具。
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">我常做的方向</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {['业务系统', '自动化工具', '数据看板', '知识库', 'AI 提效'].map((tag) => (
                        <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1.5 text-sm font-medium">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">我重视的体验</p>
                    <ul className="mt-4 space-y-3 text-sm">
                      <li>• 页面一看就知道怎么用</li>
                      <li>• 流程清楚，不靠人反复提醒</li>
                      <li>• 数据可追踪，系统可维护</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">一句话理解我</p>
                  <p className="mt-3 text-base leading-8">
                    我不是只想把页面做出来，而是想把事情做顺，把系统做稳，把使用体验做得更轻松。
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-3 md:px-8">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <CardContent className="p-5">
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-5 text-3xl font-semibold">{item.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <SectionHeading eyebrow="About" title="我希望做出什么样的产品" description={profile.intro} />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {aboutItems.map((item) => (
            <Card key={item.title} className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 leading-8 text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="skills" className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <SectionHeading
            eyebrow="Skills"
            title="技能与能力结构"
            description="我更习惯从“要解决什么问题”出发，再组合前端、后端、数据和产品能力。"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {skillGroups.map((group) => {
              const Icon = group.icon;
              return (
                <Card key={group.title} className="shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="font-semibold">{group.title}</h3>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="rounded-full px-3 py-1.5 text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <SectionHeading
          eyebrow="Projects"
          title="我做过的项目"
          description="这里放的不是纯展示型作品，而是更偏实际使用、流程优化和系统落地的项目。"
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Card key={project.name} className="flex flex-col overflow-hidden shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <CardContent className="p-0">
                <div
                  className={`h-44 border-b p-5 ${
                    index === 0
                      ? 'bg-[linear-gradient(135deg,#172554,#2563eb_58%,#dbeafe)] text-white'
                      : index === 1
                        ? 'bg-[linear-gradient(135deg,#fff7ed,#fdba74_45%,#fb7185)]'
                        : 'bg-[linear-gradient(135deg,#ffffff,#dbeafe_45%,#111827)] text-white'
                  }`}
                >
                  <div className="flex h-full flex-col justify-between rounded-[18px] border border-white/30 bg-white/10 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em]">
                      <span>Project 0{index + 1}</span>
                      <span>{project.tags[0]}</span>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{project.name}</p>
                      <p className="mt-2 max-w-xs text-sm leading-6 opacity-85">{project.summary}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-full text-xs font-semibold">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="mt-4 text-xl font-semibold">{project.name}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{project.summary}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <Badge key={tech} className="rounded-full">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <Card className="mt-5 bg-muted/30">
                    <CardContent className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">项目结果</p>
                      <p className="mt-2 text-sm leading-7">{project.metric}</p>
                    </CardContent>
                  </Card>

                  <p className="mt-5 text-sm leading-7 text-muted-foreground">
                    <span className="font-semibold text-foreground">我负责：</span>
                    {project.role}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    <span className="font-semibold text-foreground">项目亮点：</span>
                    {project.impact}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    <span className="font-semibold text-foreground">最终效果：</span>
                    {project.result}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="blog" className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <SectionHeading
            eyebrow="Writing"
            title="一些思考和记录"
            description="项目展示的是结果，文章更适合表达我怎么理解问题、怎么判断方案。"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.title} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="rounded-full">{post.category}</Badge>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      {post.date}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold leading-7">{post.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{post.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="resume" className="mx-auto grid max-w-7xl gap-8 px-4 py-20 md:grid-cols-[0.85fr_1.15fr] md:px-8">
        <div>
          <SectionHeading
            eyebrow="Resume"
            title="在线简历"
            description="这里保留一版更适合在线浏览的能力结构概览，同时支持直接下载 PDF 简历。"
          />
          <Button asChild size="lg" className="mt-8 rounded-full">
            <a href={profile.resumeUrl}>
              <Download className="mr-2 h-4 w-4" />
              下载 PDF 简历
            </a>
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-3 border-b pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold">{profile.name}</h3>
                <p className="mt-2 text-muted-foreground">{profile.role}</p>
              </div>
              <a className="text-sm font-semibold text-primary" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </div>
            <div className="mt-6 grid gap-5">
              {resumeSections.map((section) => (
                <div key={section.title}>
                  <h4 className="font-semibold">{section.title}</h4>
                  <ul className="mt-3 grid gap-2">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-2 text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <Card className="overflow-hidden bg-primary text-primary-foreground shadow-sm">
          <CardContent className="p-6 md:p-8">
            <div className="grid gap-8 md:grid-cols-[0.82fr_1.18fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">Contact</p>
                <h2 className="mt-3 text-3xl font-semibold">如果你也在做系统或工具类项目，欢迎联系我</h2>
                <p className="mt-4 leading-8 text-primary-foreground/80">
                  我更希望参与那些真的能改善协作、流程和效率的项目，而不是只停留在“做个页面”的层面。
                </p>
                <Card className="mt-6 border-white/10 bg-white/10 text-primary-foreground">
                  <CardContent className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">更适合聊的话题</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['业务系统', '自动化工具', '数据平台', 'AI 提效'].map((tag) => (
                        <Badge key={tag} variant="outline" className="rounded-full border-white/20 text-primary-foreground">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {contactLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      className="rounded-[24px] border border-white/15 bg-white/10 p-4 transition hover:bg-white/15"
                      href={link.href}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="mt-4 block text-sm text-primary-foreground/70">{link.label}</span>
                      <span className="mt-1 flex items-center gap-2 break-all font-semibold">
                        {link.value}
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </a>
                  );
                })}
                <Link
                  href="/"
                  className="rounded-[24px] border border-white/15 bg-white/10 p-4 transition hover:bg-white/15"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span className="mt-4 block text-sm text-primary-foreground/70">返回工具首页</span>
                  <span className="mt-1 flex items-center gap-2 font-semibold">
                    OnlineJsonPath
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
                <a
                  href={profile.resumeUrl}
                  className="rounded-[24px] border border-white/15 bg-white/10 p-4 transition hover:bg-white/15"
                >
                  <Download className="h-5 w-5" />
                  <span className="mt-4 block text-sm text-primary-foreground/70">PDF 简历</span>
                  <span className="mt-1 flex items-center gap-2 font-semibold">
                    下载附件
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
