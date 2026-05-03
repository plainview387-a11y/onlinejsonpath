'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { authFetch } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminShell } from '@/components/AdminShell';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ArrowRight, BarChart3, Loader2, MessageSquare, Users } from 'lucide-react';
import { toast } from 'sonner';

interface SiteStats {
  userCount: number;
  commentCount: number;
  toolUsage: Record<string, number>;
}

export default function AdminStatsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { language } = useLanguage();
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);

  const copy = {
    title: language === 'zh' ? '统计概览' : 'Stats Overview',
    desc: language === 'zh' ? '快速查看站点当前的用户规模、评论规模，以及各个工具页的活跃度分布。' : 'Quickly review user scale, comment volume, and active tool distribution across the site.',
    users: language === 'zh' ? '用户总数' : 'Users',
    comments: language === 'zh' ? '评论总数' : 'Comments',
    activeTools: language === 'zh' ? '活跃工具页数' : 'Active tools',
    chartTitle: language === 'zh' ? '评论活跃工具柱状图' : 'Comment activity by tool',
    noData: language === 'zh' ? '暂时还没有评论数据' : 'No comment data yet',
    jumpTitle: language === 'zh' ? '按工具查看评论' : 'View comments by tool',
    jumpDesc: language === 'zh' ? '按工具快速进入评论管理页，自动带上对应筛选条件。' : 'Jump to comment management with the matching tool filter applied automatically.',
    commentsUnit: language === 'zh' ? '条评论' : 'comments',
    loading: language === 'zh' ? '加载中...' : 'Loading...',
  };

  const chartConfig = {
    count: {
      label: copy.comments,
      color: '#3b82f6',
    },
  };

  const load = useCallback(async () => {
    try {
      const res = await authFetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) setStats(data.data);
      else {
        toast.error(data.error || (language === 'zh' ? '无权限访问' : 'No access'));
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

  const sortedToolUsage = useMemo(() => Object.entries(stats?.toolUsage || {}).sort((a, b) => b[1] - a[1]), [stats]);
  const chartData = useMemo(() => sortedToolUsage.map(([key, count]) => ({ tool: key, count })), [sortedToolUsage]);

  if (isLoading || loading) {
    return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />{copy.loading}</div>;
  }

  return (
    <AdminShell title={copy.title} description={copy.desc}>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Users className="h-4 w-4" />{copy.users}</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{stats?.userCount ?? '--'}</p></CardContent></Card>
        <Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><MessageSquare className="h-4 w-4" />{copy.comments}</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{stats?.commentCount ?? '--'}</p></CardContent></Card>
        <Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="h-4 w-4" />{copy.activeTools}</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{stats ? Object.keys(stats.toolUsage).length : '--'}</p></CardContent></Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />{copy.chartTitle}</CardTitle></CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[320px] w-full">
                <BarChart data={chartData} margin={{ left: 8, right: 8, top: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="tool" tickLine={false} axisLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="py-16 text-center text-sm text-muted-foreground">{copy.noData}</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader><CardTitle>{copy.jumpTitle}</CardTitle><p className="text-sm text-muted-foreground">{copy.jumpDesc}</p></CardHeader>
          <CardContent className="space-y-3">
            {sortedToolUsage.map(([key, count], index) => (
              <Link key={key} href={`/admin/comments?pageKey=${encodeURIComponent(key)}`}>
                <div className="rounded-xl border bg-background p-4 transition hover:-translate-y-0.5 hover:shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div><div className="text-sm font-medium">{index + 1}. {key}</div><div className="text-xs text-muted-foreground">{count} {copy.commentsUnit}</div></div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
            {sortedToolUsage.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">{copy.noData}</p>}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
