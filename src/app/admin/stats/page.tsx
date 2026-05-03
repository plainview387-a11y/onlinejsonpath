'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authFetch } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Loader2, Shield } from 'lucide-react';
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

  const sortedToolUsage = useMemo(() => {
    return Object.entries(stats?.toolUsage || {}).sort((a, b) => b[1] - a[1]);
  }, [stats]);

  if (isLoading || loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        加载中...
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">管理统计</h1>
          <p className="text-sm text-muted-foreground">查看当前用户量、评论总量和各工具页的评论活跃度分布。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/users')}>
            <Shield className="mr-2 h-4 w-4" />
            用户管理
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin/comments')}>
            <Shield className="mr-2 h-4 w-4" />
            评论管理
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">用户总数</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-semibold">{stats?.userCount ?? '--'}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">评论总数</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-semibold">{stats?.commentCount ?? '--'}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">活跃工具页数</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-semibold">{stats ? Object.keys(stats.toolUsage).length : '--'}</p></CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            评论活跃工具
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedToolUsage.map(([key, count], index) => {
            const max = sortedToolUsage[0]?.[1] || 1;
            const width = `${Math.max(8, Math.round((count / max) * 100))}%`;
            return (
              <div key={key} className="space-y-2 rounded-lg border p-3">
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
    </div>
  );
}
