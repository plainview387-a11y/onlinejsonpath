'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authFetch } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ProfilePasswordPage() {
  const router = useRouter();
  const { user, isLoading, login } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authFetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.token, data.user);
        setCurrentPassword('');
        setNewPassword('');
        toast.success('密码修改成功');
      } else {
        toast.error(data.error || '修改密码失败');
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
                <CardTitle>修改密码</CardTitle>
                <CardDescription>为了安全起见，需要先输入当前密码，再设置新密码。</CardDescription>
              </div>
              <Button variant="outline" onClick={() => router.push('/profile')}>返回</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">当前密码</Label>
              <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">新密码</Label>
              <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="至少 6 位" />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => router.push('/profile')}>取消</Button>
              <Button disabled={saving} onClick={handleSave}>{saving ? '保存中...' : '确认修改'}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
