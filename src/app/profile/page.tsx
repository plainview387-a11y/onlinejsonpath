'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authFetch } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface SiteStats {
  userCount: number;
  commentCount: number;
  toolUsage: Record<string, number>;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, login } = useAuth();
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch {
        // ignore stats failures
      }
    };
    loadStats();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authFetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, avatar, currentPassword, newPassword }),
      });
      const data = await res.json();

      if (data.success) {
        login(data.token, data.user);
        setCurrentPassword('');
        setNewPassword('');
        toast.success('资料更新成功');
      } else {
        toast.error(data.error || '资料更新失败');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateAvatar = async () => {
    setSaving(true);
    try {
      const res = await authFetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, regenerateAvatar: true }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.token, data.user);
        setAvatar(data.user.avatar || '');
        toast.success('头像已刷新');
      } else {
        toast.error(data.error || '头像刷新失败');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatar || user.avatar} alt={nickname || user.nickname} />
                <AvatarFallback className="text-2xl">{(nickname || user.nickname)[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.nickname}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">用户ID</p>
                <p className="text-sm font-mono break-all">{user.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">注册时间</p>
                <p className="text-sm">{new Date(user.createdAt).toLocaleString('zh-CN')}</p>
              </div>
            </div>
            <div className="pt-2">
              <Badge variant="secondary">普通用户</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>编辑资料</CardTitle>
            <CardDescription>支持修改昵称、头像和密码</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">昵称</Label>
              <Input id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">头像链接</Label>
              <Input id="avatar" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." />
              <Button variant="outline" onClick={handleRegenerateAvatar} disabled={saving}>随机换一个头像</Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">当前密码</Label>
              <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">新密码</Label>
              <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="留空表示不修改密码" />
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? '保存中...' : '保存资料'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>站点概览</CardTitle>
          <CardDescription>轻量统计基础版，方便后续判断功能热度</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">用户总数</p>
              <p className="mt-2 text-2xl font-semibold">{stats?.userCount ?? '--'}</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">评论总数</p>
              <p className="mt-2 text-2xl font-semibold">{stats?.commentCount ?? '--'}</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">工具活跃页数</p>
              <p className="mt-2 text-2xl font-semibold">{stats ? Object.keys(stats.toolUsage).length : '--'}</p>
            </div>
          </div>
          {stats && (
            <div className="mt-6 space-y-2">
              <p className="text-sm font-medium">评论活跃工具</p>
              <div className="grid gap-2 md:grid-cols-2">
                {Object.entries(stats.toolUsage)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([key, count]) => (
                    <div key={key} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                      <span>{key}</span>
                      <span className="text-muted-foreground">{count} 条评论</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
