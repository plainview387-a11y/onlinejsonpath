'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authFetch } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface UserRow {
  id: string;
  email: string;
  nickname: string;
  avatar: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await authFetch('/api/admin/users');
        const data = await res.json();
        if (data.success) setUsers(data.data.users || []);
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
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">注册用户管理</h1>
        <Button variant="outline" onClick={() => router.push('/admin/stats')}>查看统计</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>用户列表</CardTitle></CardHeader>
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
        </CardContent>
      </Card>
    </div>
  );
}
