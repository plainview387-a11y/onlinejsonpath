'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KeyRound, PencilLine, Shield, UserCircle2, CalendarDays, Mail } from 'lucide-react';

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
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Card className="overflow-hidden border-primary/15 shadow-sm">
          <CardContent className="p-0">
            <div className="border-b bg-[linear-gradient(135deg,rgba(15,23,42,1),rgba(30,41,59,0.95)_52%,rgba(59,130,246,0.85))] px-5 py-6 text-white md:px-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-white/20">
                    <AvatarImage src={user.avatar} alt={user.nickname} />
                    <AvatarFallback className="text-2xl text-slate-900">{user.nickname[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="bg-white/15 text-white hover:bg-white/15">
                        个人中心
                      </Badge>
                      {user.isAdmin ? (
                        <Badge variant="secondary" className="bg-amber-400/20 text-amber-100 hover:bg-amber-400/20">
                          管理员
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-white/10 text-white/90 hover:bg-white/10">
                          普通用户
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-2xl font-semibold md:text-3xl">{user.nickname}</h1>
                    <p className="mt-1 text-sm text-white/75">
                      在这里统一查看账号信息、修改资料、更新密码{user.isAdmin ? '以及进入后台管理' : ''}。
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/profile/edit">
                    <Button variant="secondary">
                      <PencilLine className="mr-2 h-4 w-4" />编辑资料
                    </Button>
                  </Link>
                  <Link href="/profile/password">
                    <Button
                      variant="outline"
                      className="border-white/25 bg-white/10 text-white shadow-sm hover:bg-white/15 hover:text-white"
                    >
                      <KeyRound className="mr-2 h-4 w-4" />修改密码
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle2 className="h-5 w-5" />账号信息
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground">昵称</p>
                <p className="mt-2 font-medium">{user.nickname}</p>
              </div>
              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground">邮箱</p>
                <p className="mt-2 break-all font-medium">{user.email}</p>
              </div>
              <div className="rounded-xl border bg-muted/20 p-4 sm:col-span-2">
                <p className="text-xs text-muted-foreground">用户 ID</p>
                <p className="mt-2 break-all font-mono text-sm">{user.id}</p>
              </div>
              <div className="rounded-xl border bg-muted/20 p-4 sm:col-span-2">
                <p className="text-xs text-muted-foreground">注册时间</p>
                <p className="mt-2 font-medium">{new Date(user.createdAt).toLocaleString('zh-CN')}</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />个人中心说明
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>这个页面更接近常见系统里的个人中心：上方保留高频操作，下面只展示稳定的信息区和必要入口。</p>
                <p>如果当前账号是管理员，会显示统一的后台入口；如果是普通用户，则只保留个人资料相关能力。</p>
              </CardContent>
            </Card>

            {user.isAdmin ? (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />后台管理入口
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href="/admin">
                    <div className="rounded-2xl border bg-background p-5 transition hover:-translate-y-0.5 hover:shadow-sm">
                      <div className="font-medium">进入后台控制台</div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        统一进入后台首页，并继续访问统计概览、用户管理、评论管理等全部后台功能。
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />提示
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-7 text-muted-foreground">
                  当前账号为普通用户，没有后台入口。如果以后你有管理员权限，这里会自动出现统一的后台控制台入口。
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
