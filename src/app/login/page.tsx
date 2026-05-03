'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { CaptchaPreview } from '@/components/CaptchaPreview';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const copy = {
    title: language === 'zh' ? '登录' : 'Login',
    desc: language === 'zh' ? '登录您的账号，使用 ToolNest 在线工具集' : 'Sign in to your account and use ToolNest online tools.',
    email: language === 'zh' ? '邮箱' : 'Email',
    password: language === 'zh' ? '密码' : 'Password',
    captcha: language === 'zh' ? '验证码' : 'Captcha',
    emailPlaceholder: 'your@email.com',
    passwordPlaceholder: language === 'zh' ? '输入您的密码' : 'Enter your password',
    captchaPlaceholder: language === 'zh' ? '请输入验证码' : 'Enter captcha',
    captchaTip: language === 'zh' ? '点击图片可刷新验证码' : 'Click the image to refresh the captcha',
    needEmailPassword: language === 'zh' ? '请填写邮箱和密码' : 'Please enter email and password',
    needCaptcha: language === 'zh' ? '请输入验证码' : 'Please enter the captcha',
    loginFailed: language === 'zh' ? '登录失败' : 'Login failed',
    loginRetry: language === 'zh' ? '登录失败，请稍后重试' : 'Login failed, please try again later',
    loading: language === 'zh' ? '登录中...' : 'Signing in...',
    submit: language === 'zh' ? '登录' : 'Login',
    noAccount: language === 'zh' ? '还没有账号？' : "Don't have an account?",
    register: language === 'zh' ? '立即注册' : 'Register now',
  };

  const fetchCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const response = await fetch('/api/captcha');
      const data = await response.json();
      if (data.success) {
        setCaptchaSvg(data.captcha);
        setCaptchaToken(data.token);
        setCaptchaCode('');
      }
    } catch (err) {
      console.error(language === 'zh' ? '获取验证码失败:' : 'Failed to fetch captcha:', err);
    } finally {
      setCaptchaLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(copy.needEmailPassword);
      return;
    }

    if (!captchaCode) {
      setError(copy.needCaptcha);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captchaToken, captchaCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || copy.loginFailed);
        fetchCaptcha();
        return;
      }

      login(data.token, data.user);
      router.push('/');
    } catch {
      setError(copy.loginRetry);
      fetchCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{copy.title}</CardTitle>
          <CardDescription>{copy.desc}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600"><AlertCircle className="h-4 w-4" />{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="email">{copy.email}</Label>
              <Input id="email" type="email" placeholder={copy.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{copy.password}</Label>
              <Input id="password" type="password" placeholder={copy.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="captcha">{copy.captcha}</Label>
              <div className="flex gap-3">
                <Input id="captcha" type="text" placeholder={copy.captchaPlaceholder} value={captchaCode} onChange={(e) => setCaptchaCode(e.target.value)} className="flex-1" maxLength={4} />
                <CaptchaPreview svg={captchaSvg} loading={captchaLoading} onRefresh={fetchCaptcha} />
              </div>
              <p className="text-xs text-muted-foreground">{copy.captchaTip}</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? copy.loading : copy.submit}</Button>
            <p className="text-sm text-muted-foreground">{copy.noAccount}{' '}<Link href="/register" className="text-primary hover:underline">{copy.register}</Link></p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
