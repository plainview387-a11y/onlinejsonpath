'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, MessageSquare, Shield, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { cn } from '@/lib/utils';

const adminNav = [
  { href: '/admin', label: '控制台', icon: Shield, desc: '查看后台总入口与摘要' },
  { href: '/admin/stats', label: '统计概览', icon: BarChart3, desc: '查看站点核心数据' },
  { href: '/admin/users', label: '用户管理', icon: Users, desc: '浏览注册用户列表' },
  { href: '/admin/comments', label: '评论管理', icon: MessageSquare, desc: '维护工具页评论内容' },
];

export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Card className="overflow-hidden border-primary/15 shadow-sm">
          <CardContent className="p-0">
            <div className="border-b bg-[linear-gradient(135deg,rgba(15,23,42,1),rgba(30,41,59,0.95)_52%,rgba(59,130,246,0.85))] px-5 py-6 text-white md:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <Badge variant="secondary" className="mb-3 bg-white/12 text-white hover:bg-white/12">
                    <Shield className="mr-1 h-3.5 w-3.5" />
                    Admin Console
                  </Badge>
                  <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-white/75">{description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <BackButton fallbackHref="/profile" />
                  {actions}
                </div>
              </div>
            </div>

            <div className="grid gap-3 border-b bg-muted/25 p-4 md:grid-cols-2 xl:grid-cols-4 md:p-5">
              {adminNav.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        'rounded-2xl border bg-background p-4 transition hover:-translate-y-0.5 hover:shadow-sm',
                        active && 'border-primary bg-primary/5 shadow-sm'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn('grid h-10 w-10 place-items-center rounded-xl bg-muted text-muted-foreground', active && 'bg-primary text-primary-foreground')}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.desc}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function AdminToolbar({ children }: { children: React.ReactNode }) {
  return <Card className="mb-6"><CardContent className="p-4 md:p-5">{children}</CardContent></Card>;
}

export function AdminActionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <Button variant="outline">{children}</Button>
    </Link>
  );
}
