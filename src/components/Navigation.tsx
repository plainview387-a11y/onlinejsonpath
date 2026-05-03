'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Code, User as UserIcon, LogOut, Wrench, BriefcaseBusiness } from 'lucide-react';
import { TOOLS } from '@/lib/tools';

export function Navigation() {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const copy = {
    brand: language === 'zh' ? 'ToolNest' : 'ToolNest',
    home: language === 'zh' ? '首页' : 'Home',
    project: language === 'zh' ? '作品页' : 'Portfolio',
    toolbox: language === 'zh' ? '工具箱' : 'Tools',
    profile: language === 'zh' ? '个人中心' : 'Profile',
    logout: language === 'zh' ? '退出登录' : 'Logout',
    login: language === 'zh' ? '登录' : 'Login',
    register: language === 'zh' ? '注册' : 'Register',
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Code className="h-6 w-6" />
          <span className="text-lg font-bold">{copy.brand}</span>
        </Link>

        <div className="hidden items-center space-x-1 md:flex">
          <Link
            href="/"
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
              pathname === '/' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
          >
            {copy.home}
          </Link>

          <Link
            href="/projects/ai-project"
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
              pathname.startsWith('/projects/ai-project') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <BriefcaseBusiness className="h-4 w-4" />
              AIProject
            </span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname.startsWith('/tools') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`}
              >
                <Wrench className="mr-1 h-4 w-4" />
                {copy.toolbox}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <DropdownMenuItem key={tool.href} asChild>
                    <Link href={tool.href} className="cursor-pointer">
                      <Icon className="mr-2 h-4 w-4" />
                      {tool.navLabel}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-2">
          <LanguageToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.nickname} />
                    <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.nickname}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    {copy.profile}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  {copy.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {copy.login}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">{copy.register}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
