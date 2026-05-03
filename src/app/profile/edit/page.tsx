'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authFetch } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, isLoading, login } = useAuth();
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const saveProfile = async (payload: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await authFetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        login(data.token, data.user);
        setAvatar(data.user.avatar || '');
        setNickname(data.user.nickname || '');
        toast.success('个人信息已更新');
      } else {
        toast.error(data.error || '更新失败');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !user) return <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">加载中...</div>;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Card className="shadow-sm">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>修改个人信息</CardTitle>
                <CardDescription>在这里更新昵称和头像，密码修改请走独立页面。</CardDescription>
              </div>
              <Button variant="outline" onClick={() => router.push('/profile')}>返回</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatar || user.avatar} alt={nickname || user.nickname} />
                <AvatarFallback className="text-2xl">{(nickname || user.nickname)[0]}</AvatarFallback>
              </Avatar>
              <Button variant="outline" disabled={saving} onClick={() => saveProfile({ nickname, regenerateAvatar: true })}>
                随机更换头像
              </Button>
            </div>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">昵称</Label>
                <Input id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">头像链接</Label>
                <Input id="avatar" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => router.push('/profile')}>取消</Button>
              <Button disabled={saving} onClick={() => saveProfile({ nickname, avatar })}>{saving ? '保存中...' : '保存修改'}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
