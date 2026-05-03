'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authFetch } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminShell } from '@/components/AdminShell';
import { BarChart3, Loader2, MessageSquare, Users } from 'lucide-react';
import { toast } from 'sonner';

interface SiteStats {
  userCount: number;
  commentCount: number;
  toolUsage: Record<string, number>;
}

export default function AdminStatsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await authFetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) setStats(data.data);
      else {
        toast.error(data.error || '无权限访问');
        router.push('/profile');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const sortedToolUsage = useMemo(() => Object.entries(stats?.toolUsage || {}).sort((a, b) => b[1] - a[1]), [stats]);

  if (isLoading || loading) {
    return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />加载中...</div>;
  }

  return (
    <AdminShell title="统计概览" description="快速查看站点当前的用户规模、评论规模，以及各个工具页的活跃度分布。">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Users className="h-4 w-4" />用户总数</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-semibold">{stats?.userCount ?? '--'}</p></CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><MessageSquare className="h-4 w-4" />评论总数</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-semibold">{stats?.commentCount ?? '--'}</p></CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="h-4 w-4" />活跃工具页数</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-semibold">{stats ? Object.keys(stats.toolUsage).length : '--'}</p></CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-sm">
        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />评论活跃工具</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {sortedToolUsage.map(([key, count], index) => {
            const max = sortedToolUsage[0]?.[1] || 1;
            const width = `${Math.max(8, Math.round((count / max) * 100))}%`;
            return (
              <div key={key} className="space-y-2 rounded-xl border bg-background p-4">
                <div className="flex items-center justify-between text-sm">
                  <span>{index + 1}. {key}</span>
                  <span className="text-muted-foreground">{count} 条评论</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width }} />
                </div>
              </div>
            );
          })}
          {sortedToolUsage.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">暂时还没有评论数据</p>}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
