'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KeyRound, PencilLine, Shield, UserCircle2, Settings2, CalendarDays, Mail } from 'lucide-react';

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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Card className="overflow-hidden border-primary/15 shadow-sm">
          <CardContent className="p-0">
            <div className="border-b bg-[linear-gradient(135deg,rgba(15,23,42,1),rgba(30,41,59,0.95)_52%,rgba(59,130,246,0.85))] px-5 py-6 text-white md:px-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-white/20">
                    <AvatarImage src={user.avatar} alt={user.nickname} />
                    <AvatarFallback className="text-2xl text-slate-900">{user.nickname[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="bg-white/15 text-white hover:bg-white/15">个人中心</Badge>
                      {user.isAdmin ? <Badge variant="secondary" className="bg-amber-400/20 text-amber-100 hover:bg-amber-400/20">管理员</Badge> : <Badge variant="secondary" className="bg-white/10 text-white/90 hover:bg-white/10">普通用户</Badge>}
                    </div>
                    <h1 className="text-2xl font-semibold md:text-3xl">{user.nickname}</h1>
                    <p className="mt-1 text-sm text-white/75">在这里统一查看账号信息、修改资料、更新密码和进入后台管理。</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href="/profile/edit"><Button variant="secondary"><PencilLine className="mr-2 h-4 w-4" />编辑资料</Button></Link>
                  <Link href="/profile/password"><Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white"><KeyRound className="mr-2 h-4 w-4" />修改密码</Button></Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2"><UserCircle2 className="h-5 w-5" />账号信息</CardTitle></CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border bg-muted/20 p-4">
                  <p className="text-xs text-muted-foreground">昵称</p>
                  <p className="mt-2 font-medium">{user.nickname}</p>
                </div>
                <div className="rounded-xl border bg-muted/20 p-4">
                  <p className="text-xs text-muted-foreground">邮箱</p>
                  <p className="mt-2 font-medium break-all">{user.email}</p>
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

            <Card className="shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5" />快捷操作</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Link href="/profile/edit"><Button variant="outline" className="w-full justify-start"><PencilLine className="mr-2 h-4 w-4" />修改个人信息</Button></Link>
                <Link href="/profile/password"><Button variant="outline" className="w-full justify-start"><KeyRound className="mr-2 h-4 w-4" />修改密码</Button></Link>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5" />个人中心说明</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>这个页面更接近多数系统里的个人中心：顶部展示当前身份与常用操作，下面按“账号信息 / 快捷操作 / 管理入口”分区。</p>
                <p>如果你只是普通用户，这里主要用于维护个人资料；如果你是管理员，还会出现后台入口。</p>
              </CardContent>
            </Card>

            {user.isAdmin ? (
              <Card className="shadow-sm">
                <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />后台管理入口</CardTitle></CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  <Link href="/admin/stats">
                    <div className="rounded-2xl border bg-background p-4 transition hover:-translate-y-0.5 hover:shadow-sm">
                      <div className="font-medium">统计概览</div>
                      <div className="mt-1 text-sm text-muted-foreground">查看评论活跃度与站点规模</div>
                    </div>
                  </Link>
                  <Link href="/admin/users">
                    <div className="rounded-2xl border bg-background p-4 transition hover:-translate-y-0.5 hover:shadow-sm">
                      <div className="font-medium">用户管理</div>
                      <div className="mt-1 text-sm text-muted-foreground">按昵称和邮箱筛选注册用户</div>
                    </div>
                  </Link>
                  <Link href="/admin/comments">
                    <div className="rounded-2xl border bg-background p-4 transition hover:-translate-y-0.5 hover:shadow-sm sm:col-span-2">
                      <div className="font-medium">评论管理</div>
                      <div className="mt-1 text-sm text-muted-foreground">管理各个工具页的评论内容，按页面定位问题评论</div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-sm">
                <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" />提示</CardTitle></CardHeader>
                <CardContent className="text-sm leading-7 text-muted-foreground">
                  当前账号为普通用户，没有后台入口。如果以后你有管理员权限，这里会自动出现后台控制台入口。
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
