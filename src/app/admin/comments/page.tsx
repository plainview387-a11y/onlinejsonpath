'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { language } = useLanguage();
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [query, setQuery] = useState('');
  const [pageKey, setPageKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [pendingDelete, setPendingDelete] = useState<AdminComment | null>(null);

  const copy = {
    title: language === 'zh' ? '评论管理' : 'Comment Management',
    desc: language === 'zh' ? '在这里集中查看工具页评论、按页面和关键词筛选，并处理不合适的评论内容。' : 'Review tool comments, filter by page or keyword, and moderate inappropriate content.',
    searchComment: language === 'zh' ? '搜索评论内容...' : 'Search comment content...',
    searchPage: language === 'zh' ? '按页面标识筛选，如 jsonpath' : 'Filter by page key, e.g. jsonpath',
    search: language === 'zh' ? '查询' : 'Search',
    clear: language === 'zh' ? '清空' : 'Clear',
    total: language === 'zh' ? '共' : 'Total',
    comments: language === 'zh' ? '条评论' : 'comments',
    currentPage: language === 'zh' ? '当前第' : 'Page',
    currentFilter: language === 'zh' ? '当前筛选' : 'Current filter',
    list: language === 'zh' ? '评论列表' : 'Comment List',
    reply: language === 'zh' ? '回复' : 'Reply',
    noEmail: language === 'zh' ? '无邮箱' : 'No email',
    delete: language === 'zh' ? '删除' : 'Delete',
    empty: language === 'zh' ? '暂无符合条件的评论' : 'No matching comments',
    loading: language === 'zh' ? '加载中...' : 'Loading...',
    confirmTitle: language === 'zh' ? '确认删除这条评论？' : 'Delete this comment?',
    confirmDesc: language === 'zh' ? '管理员删除同样遵循当前限制：如果主评论下还有回复，系统会拒绝直接删除。' : 'Admin deletion follows the same rule: if a top-level comment still has replies, direct deletion is blocked.',
    confirm: language === 'zh' ? '确认删除' : 'Confirm Delete',
    cancel: language === 'zh' ? '取消' : 'Cancel',
  };

  const loadComments = useCallback(async (targetPage = pagination.page, targetPageSize = pagination.pageSize, nextQuery = query, nextPageKey = pageKey) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (nextQuery.trim()) params.set('query', nextQuery.trim());
      if (nextPageKey.trim()) params.set('pageKey', nextPageKey.trim());
      params.set('page', String(targetPage));
      params.set('pageSize', String(targetPageSize));

      const res = await authFetch(`/api/admin/comments?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data.comments || []);
        setPagination(data.data.pagination);
      } else {
        toast.error(data.error || (language === 'zh' ? '无权限访问' : 'No access'));
        router.push('/profile');
      }
    } catch {
      toast.error(language === 'zh' ? '网络错误' : 'Network error');
    } finally {
      setLoading(false);
    }
  }, [pageKey, pagination.page, pagination.pageSize, query, router, language]);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('query') || '';
    const initialPageKey = params.get('pageKey') || '';
    setQuery(initialQuery);
    setPageKey(initialPageKey);
    if (user) loadComments(1, pagination.pageSize, initialQuery, initialPageKey);
  }, [user, loadComments, pagination.pageSize]);

  const handleSearch = () => loadComments(1, pagination.pageSize, query, pageKey);
  const clearFilters = () => {
    setQuery('');
    setPageKey('');
    setTimeout(() => loadComments(1, pagination.pageSize, '', ''), 0);
  };
  const changePageSize = (nextPageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize: nextPageSize }));
    loadComments(1, nextPageSize, query, pageKey);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      const res = await authFetch(`/api/admin/comments?id=${encodeURIComponent(pendingDelete.id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success(language === 'zh' ? '评论已删除' : 'Comment deleted');
        setPendingDelete(null);
        loadComments(pagination.page, pagination.pageSize, query, pageKey);
      } else {
        toast.error(data.error || (language === 'zh' ? '删除评论失败' : 'Failed to delete comment'));
      }
    } catch {
      toast.error(language === 'zh' ? '网络错误' : 'Network error');
    }
  };

  if (isLoading || loading) {
    return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />{copy.loading}</div>;
  }

  return (
    <>
      <AdminShell title={copy.title} description={copy.desc}>
        <AdminToolbar>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_220px_140px_auto_auto]">
              <Input placeholder={copy.searchComment} value={query} onChange={(e) => setQuery(e.target.value)} />
              <Input placeholder={copy.searchPage} value={pageKey} onChange={(e) => setPageKey(e.target.value)} />
              <select className="h-10 rounded-md border bg-background px-3 text-sm" value={pagination.pageSize} onChange={(e) => changePageSize(Number(e.target.value))}>
                {[10, 20, 50, 100].map((size) => <option key={size} value={size}>{size} / page</option>)}
              </select>
              <Button onClick={handleSearch}>{copy.search}</Button>
              <Button variant="ghost" onClick={clearFilters}>{copy.clear}</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>{copy.total} {pagination.total} {copy.comments}，{copy.currentPage} {pagination.page} / {Math.max(pagination.totalPages, 1)}</span>
              {pageKey ? <Badge variant="secondary">{copy.currentFilter}: {pageKey}</Badge> : null}
            </div>
          </div>
        </AdminToolbar>

        <Card>
          <CardHeader><CardTitle>{copy.list}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {comments.map((item) => (
              <div key={item.id} className="rounded-2xl border bg-background p-4 shadow-sm">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">{item.pageKey}</Badge>
                  {item.isReply && <Badge variant="outline">{copy.reply}</Badge>}
                  <span>{new Date(item.createdAt).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')}</span>
                </div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div><div className="text-sm font-medium">{item.user.nickname}</div><div className="text-xs text-muted-foreground">{item.user.email || copy.noEmail} · {item.user.id.slice(0, 8)}...</div></div>
                  <Button variant="outline" size="sm" onClick={() => setPendingDelete(item)}><Trash2 className="mr-1 h-4 w-4" />{copy.delete}</Button>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-7">{item.content}</p>
              </div>
            ))}
            {comments.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">{copy.empty}</p>}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <Button variant="outline" size="icon" onClick={() => loadComments(pagination.page - 1, pagination.pageSize, query, pageKey)} disabled={pagination.page <= 1}><ChevronLeft className="h-4 w-4" /></Button>
                <span className="min-w-20 text-center text-sm text-muted-foreground">{pagination.page} / {pagination.totalPages}</span>
                <Button variant="outline" size="icon" onClick={() => loadComments(pagination.page + 1, pagination.pageSize, query, pageKey)} disabled={pagination.page >= pagination.totalPages}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            )}
          </CardContent>
        </Card>
      </AdminShell>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{copy.confirmDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{copy.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>{copy.confirm}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
