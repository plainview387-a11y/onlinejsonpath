'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authFetch } from '@/lib/auth-client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminShell, AdminToolbar } from '@/components/AdminShell';
import { ChevronLeft, ChevronRight, Loader2, Trash2 } from 'lucide-react';
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

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function AdminCommentsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [query, setQuery] = useState('');
  const [pageKey, setPageKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [pendingDelete, setPendingDelete] = useState<AdminComment | null>(null);

  const loadComments = useCallback(async (targetPage = pagination.page, targetPageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('query', query.trim());
      if (pageKey.trim()) params.set('pageKey', pageKey.trim());
      params.set('page', String(targetPage));
      params.set('pageSize', String(targetPageSize));

      const res = await authFetch(`/api/admin/comments?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data.comments || []);
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
  }, [pageKey, pagination.page, pagination.pageSize, query, router]);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) loadComments(1, pagination.pageSize);
  }, [user, loadComments, pagination.pageSize]);

  const handleSearch = () => loadComments(1, pagination.pageSize);
  const clearFilters = () => {
    setQuery('');
    setPageKey('');
    setTimeout(() => loadComments(1, pagination.pageSize), 0);
  };
  const changePageSize = (nextPageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize: nextPageSize }));
    loadComments(1, nextPageSize);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      const res = await authFetch(`/api/admin/comments?id=${encodeURIComponent(pendingDelete.id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('评论已删除');
        setPendingDelete(null);
        loadComments(pagination.page, pagination.pageSize);
      } else {
        toast.error(data.error || '删除评论失败');
      }
    } catch {
      toast.error('网络错误');
    }
  };

  if (isLoading || loading) {
    return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />加载中...</div>;
  }

  return (
    <>
      <AdminShell title="评论管理" description="在这里集中查看工具页评论、按页面和关键词筛选，并处理不合适的评论内容。">
        <AdminToolbar>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_220px_140px_auto_auto]">
              <Input placeholder="搜索评论内容..." value={query} onChange={(e) => setQuery(e.target.value)} />
              <Input placeholder="按页面标识筛选，如 jsonpath" value={pageKey} onChange={(e) => setPageKey(e.target.value)} />
              <select className="h-10 rounded-md border bg-background px-3 text-sm" value={pagination.pageSize} onChange={(e) => changePageSize(Number(e.target.value))}>
                {[10, 20, 50, 100].map((size) => <option key={size} value={size}>{size} / 页</option>)}
              </select>
              <Button onClick={handleSearch}>查询</Button>
              <Button variant="ghost" onClick={clearFilters}>清空</Button>
            </div>
            <div className="text-xs text-muted-foreground">共 {pagination.total} 条评论，当前第 {pagination.page} / {Math.max(pagination.totalPages, 1)} 页</div>
          </div>
        </AdminToolbar>

        <Card>
          <CardHeader><CardTitle>评论列表</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {comments.map((item) => (
              <div key={item.id} className="rounded-2xl border bg-background p-4 shadow-sm">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">{item.pageKey}</Badge>
                  {item.isReply && <Badge variant="outline">回复</Badge>}
                  <span>{new Date(item.createdAt).toLocaleString('zh-CN')}</span>
                </div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{item.user.nickname}</div>
                    <div className="text-xs text-muted-foreground">{item.user.email || '无邮箱'} · {item.user.id.slice(0, 8)}...</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setPendingDelete(item)}>
                    <Trash2 className="mr-1 h-4 w-4" />删除
                  </Button>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-7">{item.content}</p>
              </div>
            ))}
            {comments.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">暂无符合条件的评论</p>}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <Button variant="outline" size="icon" onClick={() => loadComments(pagination.page - 1, pagination.pageSize)} disabled={pagination.page <= 1}><ChevronLeft className="h-4 w-4" /></Button>
                <span className="min-w-20 text-center text-sm text-muted-foreground">{pagination.page} / {pagination.totalPages}</span>
                <Button variant="outline" size="icon" onClick={() => loadComments(pagination.page + 1, pagination.pageSize)} disabled={pagination.page >= pagination.totalPages}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            )}
          </CardContent>
        </Card>
      </AdminShell>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除这条评论？</AlertDialogTitle>
            <AlertDialogDescription>管理员删除同样遵循当前限制：如果主评论下还有回复，系统会拒绝直接删除。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
