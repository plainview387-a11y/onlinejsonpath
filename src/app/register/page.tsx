'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { CaptchaPreview } from '@/components/CaptchaPreview';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 获取验证码
  const fetchCaptcha = async () => {
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
      console.error('获取验证码失败:', err);
    } finally {
      setCaptchaLoading(false);
    }
  };

  // 页面加载时获取验证码
  useEffect(() => {
    fetchCaptcha();
  }, []);

  // 密码强度检测
  const checkPasswordStrength = (pwd: string) => {
    const checks = {
      length: pwd.length >= 6,
      hasLower: /[a-z]/.test(pwd),
      hasUpper: /[A-Z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const { checks, score } = checkPasswordStrength(password);
  const strengthLabel = score <= 2 ? '弱' : score <= 3 ? '中等' : score <= 4 ? '强' : '非常强';
  const strengthColor = score <= 2 ? 'text-red-500' : score <= 3 ? 'text-yellow-500' : 'text-green-500';

  // 邮箱格式验证
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword || !nickname) {
      setError('请填写完整信息');
      return;
    }

    if (!isValidEmail) {
      setError('邮箱格式不正确');
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少6位');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (!captchaCode) {
      setError('请输入验证码');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, nickname, captchaToken, captchaCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '注册失败');
        fetchCaptcha(); // 刷新验证码
        return;
      }

      if (data.token && data.user) {
        login(data.token, data.user);
        router.push('/');
        return;
      }

      // 注册成功后自动登录
      // 需要先获取新的验证码用于登录
      const captchaRes = await fetch('/api/captcha');
      const captchaData = await captchaRes.json();
      
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          captchaToken: captchaData.token,
          captchaCode: captchaData.code || captchaCode
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok && loginData.token) {
        login(loginData.token, loginData.user);
        router.push('/');
      } else {
        router.push('/login');
      }
    } catch {
      setError('注册失败，请稍后重试');
      fetchCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">注册账号</CardTitle>
          <CardDescription>创建您的账号，开始使用在线工具集</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={email && !isValidEmail ? 'border-red-500' : ''}
              />
              {email && !isValidEmail && (
                <p className="text-xs text-red-500">请输入有效的邮箱地址</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">昵称</Label>
              <Input
                id="nickname"
                type="text"
                placeholder="您的昵称"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="至少6位字符"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={strengthColor}>密码强度: {strengthLabel}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 rounded ${
                          score >= level
                            ? score <= 2
                              ? 'bg-red-500'
                              : score <= 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      {checks.length ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-gray-300" />
                      )}
                      至少6位
                    </span>
                    <span className="flex items-center gap-1">
                      {checks.hasLower ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-gray-300" />
                      )}
                      小写字母
                    </span>
                    <span className="flex items-center gap-1">
                      {checks.hasUpper ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-gray-300" />
                      )}
                      大写字母
                    </span>
                    <span className="flex items-center gap-1">
                      {checks.hasNumber ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-gray-300" />
                      )}
                      数字
                    </span>
                    <span className="flex items-center gap-1">
                      {checks.hasSpecial ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-gray-300" />
                      )}
                      特殊字符
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={confirmPassword && password !== confirmPassword ? 'border-red-500' : ''}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500">两次输入的密码不一致</p>
              )}
            </div>

            {/* 验证码 */}
            <div className="space-y-2">
              <Label htmlFor="captcha">验证码</Label>
              <div className="flex gap-3">
                <Input
                  id="captcha"
                  type="text"
                  placeholder="请输入验证码"
                  value={captchaCode}
                  onChange={(e) => setCaptchaCode(e.target.value)}
                  className="flex-1"
                  maxLength={4}
                />
                <CaptchaPreview svg={captchaSvg} loading={captchaLoading} onRefresh={fetchCaptcha} />
              </div>
              <p className="text-xs text-muted-foreground">点击图片可刷新验证码</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '注册中...' : '注册'}
            </Button>
            <p className="text-sm text-muted-foreground">
              已有账号？{' '}
              <Link href="/login" className="text-primary hover:underline">
                立即登录
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
