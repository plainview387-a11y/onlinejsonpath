'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authFetch } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  useEffect(() => {
    const load = async () => {
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
    };
    if (user) load();
  }, [user, router]);

  if (isLoading || loading) return <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">加载中...</div>;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">管理统计</h1>
        <Button variant="outline" onClick={() => router.push('/profile')}>返回个人中心</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-base">用户总数</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{stats?.userCount ?? '--'}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">评论总数</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{stats?.commentCount ?? '--'}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">活跃工具页数</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{stats ? Object.keys(stats.toolUsage).length : '--'}</p></CardContent></Card>
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>评论活跃工具</CardTitle></CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2">
          {stats && Object.entries(stats.toolUsage).sort((a,b)=>b[1]-a[1]).map(([key,count]) => (
            <div key={key} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
              <span>{key}</span><span className="text-muted-foreground">{count} 条评论</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
