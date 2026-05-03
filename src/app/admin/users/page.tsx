'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authFetch } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface UserRow {
  id: string;
  email: string;
  nickname: string;
  avatar: string;
  created_at: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });

  const load = useCallback(async (targetPage = pagination.page, targetPageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(targetPage));
      params.set('pageSize', String(targetPageSize));
      if (query.trim()) params.set('query', query.trim());

      const res = await authFetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data.users || []);
        setPagination(data.data.pagination);
      } else {
        toast.error(data.error || '无权限访问');
        router.push('/profile');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, query, router]);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) load(1, pagination.pageSize);
  }, [user, load, pagination.pageSize]);

  const clearQuery = () => {
    setQuery('');
    setTimeout(() => load(1, pagination.pageSize), 0);
  };

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
          <h1 className="text-2xl font-semibold">注册用户管理</h1>
          <p className="text-sm text-muted-foreground">查看注册用户列表、分页浏览和按邮箱 / 昵称关键字筛选。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/stats')}>
            <Shield className="mr-2 h-4 w-4" />
            查看统计
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin/comments')}>
            <Shield className="mr-2 h-4 w-4" />
            评论管理
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>筛选与分页</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_140px_auto_auto]">
            <Input placeholder="搜索昵称或邮箱..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <select
              className="h-10 rounded-md border bg-background px-3 text-sm"
              value={pagination.pageSize}
              onChange={(e) => load(1, Number(e.target.value))}
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>{size} / 页</option>
              ))}
            </select>
            <Button onClick={() => load(1, pagination.pageSize)}>查询</Button>
            <Button variant="ghost" onClick={clearQuery}>清空</Button>
          </div>
          <div className="text-xs text-muted-foreground">共 {pagination.total} 位用户，当前第 {pagination.page} / {Math.max(pagination.totalPages, 1)} 页</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {users.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-xl border p-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={item.avatar} alt={item.nickname} />
                <AvatarFallback>{item.nickname?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.nickname}</p>
                <p className="truncate text-sm text-muted-foreground">{item.email}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>{new Date(item.created_at).toLocaleDateString('zh-CN')}</p>
                <p className="font-mono text-xs">{item.id.slice(0, 8)}...</p>
              </div>
            </div>
          ))}
          {users.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">暂无符合条件的用户</p>}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button variant="outline" size="icon" onClick={() => load(pagination.page - 1, pagination.pageSize)} disabled={pagination.page <= 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-20 text-center text-sm text-muted-foreground">{pagination.page} / {pagination.totalPages}</span>
              <Button variant="outline" size="icon" onClick={() => load(pagination.page + 1, pagination.pageSize)} disabled={pagination.page >= pagination.totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
