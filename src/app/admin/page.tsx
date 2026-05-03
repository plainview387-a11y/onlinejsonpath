'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { authFetch } from '@/lib/auth-client';
import { AdminShell } from '@/components/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BarChart3, Loader2, MessageSquare, Users } from 'lucide-react';
import { toast } from 'sonner';

interface SiteStats {
  userCount: number;
  commentCount: number;
  toolUsage: Record<string, number>;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { language } = useLanguage();
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);

  const copy = {
    title: language === 'zh' ? '后台控制台' : 'Admin Console',
    desc: language === 'zh' ? '这里是统一的管理入口，先看整体情况，再进入统计、用户和评论等具体模块。' : 'This is the unified admin entry. Start with the overview, then enter stats, users, and comments.',
    userCount: language === 'zh' ? '用户总数' : 'Users',
    commentCount: language === 'zh' ? '评论总数' : 'Comments',
    activeTools: language === 'zh' ? '活跃工具页' : 'Active tools',
    modules: language === 'zh' ? '后台模块' : 'Admin modules',
    modulesDesc: language === 'zh' ? '统一进入各个后台功能模块，优先处理评论与数据概览。' : 'Enter each admin module from one place, with comments and data overview as the top priorities.',
    hotTools: language === 'zh' ? '当前最活跃工具' : 'Most active tools',
    hotToolsDesc: language === 'zh' ? '点击条目可直接进入对应工具的评论筛选结果。' : 'Click an item to jump directly to filtered comments for that tool.',
    loading: language === 'zh' ? '加载中...' : 'Loading...',
    noData: language === 'zh' ? '暂时还没有评论数据' : 'No comment data yet',
    links: language === 'zh'
      ? [
          { href: '/admin/stats', title: '统计概览', desc: '查看站点用户量、评论量和活跃工具分布', icon: BarChart3 },
          { href: '/admin/users', title: '用户管理', desc: '浏览注册用户，支持筛选与分页', icon: Users },
          { href: '/admin/comments', title: '评论管理', desc: '按工具查看评论并处理不合适内容', icon: MessageSquare },
        ]
      : [
          { href: '/admin/stats', title: 'Stats Overview', desc: 'Review user count, comments, and active tool distribution', icon: BarChart3 },
          { href: '/admin/users', title: 'User Management', desc: 'Browse registered users with filtering and pagination', icon: Users },
          { href: '/admin/comments', title: 'Comment Management', desc: 'Review and moderate comments by tool', icon: MessageSquare },
        ],
  };

  const load = useCallback(async () => {
    try {
      const res = await authFetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) setStats(data.data);
      else {
        toast.error(data.error || 'No access');
        router.push('/profile');
      }
    } catch {
      toast.error(language === 'zh' ? '网络错误' : 'Network error');
    } finally {
      setLoading(false);
    }
  }, [router, language]);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const topTools = useMemo(() => Object.entries(stats?.toolUsage || {}).sort((a, b) => b[1] - a[1]).slice(0, 5), [stats]);

  if (isLoading || loading) {
    return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />{copy.loading}</div>;
  }

  return (
    <AdminShell title={copy.title} description={copy.desc}>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm"><CardHeader><CardTitle className="text-base">{copy.userCount}</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{stats?.userCount ?? '--'}</p></CardContent></Card>
        <Card className="shadow-sm"><CardHeader><CardTitle className="text-base">{copy.commentCount}</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{stats?.commentCount ?? '--'}</p></CardContent></Card>
        <Card className="shadow-sm"><CardHeader><CardTitle className="text-base">{copy.activeTools}</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{stats ? Object.keys(stats.toolUsage).length : '--'}</p></CardContent></Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="shadow-sm">
          <CardHeader><CardTitle>{copy.modules}</CardTitle><p className="text-sm text-muted-foreground">{copy.modulesDesc}</p></CardHeader>
          <CardContent className="grid gap-4">
            {copy.links.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div className="rounded-2xl border bg-background p-5 transition hover:-translate-y-0.5 hover:shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                        <div><div className="font-medium">{item.title}</div><div className="mt-1 text-sm leading-6 text-muted-foreground">{item.desc}</div></div>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader><CardTitle>{copy.hotTools}</CardTitle><p className="text-sm text-muted-foreground">{copy.hotToolsDesc}</p></CardHeader>
          <CardContent className="space-y-3">
            {topTools.map(([key, count], index) => (
              <Link key={key} href={`/admin/comments?pageKey=${encodeURIComponent(key)}`}>
                <div className="rounded-xl border bg-background p-4 transition hover:-translate-y-0.5 hover:shadow-sm"><div className="flex items-center justify-between gap-3 text-sm"><span>{index + 1}. {key}</span><span className="text-muted-foreground">{count}</span></div></div>
              </Link>
            ))}
            {topTools.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">{copy.noData}</p>}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
