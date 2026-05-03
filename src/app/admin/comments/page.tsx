'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authFetch } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AdminComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  pageKey: string;
  parentId: string | null;
  isReply: boolean;
  user: { id: string; email: string; nickname: string; avatar: string };
}

export default function AdminCommentsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [query, setQuery] = useState('');
  const [pageKey, setPageKey] = useState('');
  const [loading, setLoading] = useState(true);

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('query', query.trim());
      if (pageKey.trim()) params.set('pageKey', pageKey.trim());
      const res = await authFetch(`/api/admin/comments?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data.comments || []);
      } else {
        toast.error(data.error || '无权限访问');
        router.push('/profile');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setLoading(false);
    }
  }, [pageKey, query, router]);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) loadComments();
  }, [user, loadComments]);

  if (isLoading || loading) return <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">加载中...</div>;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">评论管理</h1>
          <p className="text-sm text-muted-foreground">查看全站评论，后续这里会继续接删除与逻辑删除能力。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/stats')}>统计</Button>
          <Button variant="outline" onClick={() => router.push('/admin/users')}>用户</Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>筛选</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
          <Input placeholder="搜索评论内容..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <Input placeholder="按页面标识筛选，如 jsonpath" value={pageKey} onChange={(e) => setPageKey(e.target.value)} />
          <Button onClick={loadComments}>查询</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>评论列表</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {comments.map((item) => (
            <div key={item.id} className="rounded-xl border p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">{item.pageKey}</Badge>
                {item.isReply && <Badge variant="outline">回复</Badge>}
                <span>{new Date(item.createdAt).toLocaleString('zh-CN')}</span>
              </div>
              <div className="mb-2 text-sm font-medium">{item.user.nickname} · {item.user.email}</div>
              <p className="whitespace-pre-wrap text-sm leading-7">{item.content}</p>
            </div>
          ))}
          {comments.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">暂无符合条件的评论</p>}
        </CardContent>
      </Card>
    </div>
  );
}
