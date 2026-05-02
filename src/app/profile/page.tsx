'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KeyRound, PencilLine, Shield } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

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
                <AvatarImage src={user.avatar} alt={user.nickname} />
                <AvatarFallback className="text-2xl">{user.nickname[0]}</AvatarFallback>
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
            <CardTitle>账号管理</CardTitle>
            <CardDescription>个人信息和密码修改分开处理，更符合正常使用习惯</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/profile/edit">
              <Button variant="outline" className="w-full justify-start">
                <PencilLine className="mr-2 h-4 w-4" />
                修改个人信息
              </Button>
            </Link>
            <Link href="/profile/password">
              <Button variant="outline" className="w-full justify-start">
                <KeyRound className="mr-2 h-4 w-4" />
                修改密码
              </Button>
            </Link>
            <div className="rounded-xl border bg-muted/30 p-4 text-sm leading-7 text-muted-foreground">
              后续如果你有管理员权限，站点统计和注册用户列表会放到单独的管理入口，而不是默认暴露在个人中心里。
            </div>
            <Link href="/admin/stats">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <Shield className="mr-2 h-4 w-4" />
                管理统计入口（需管理员权限）
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
