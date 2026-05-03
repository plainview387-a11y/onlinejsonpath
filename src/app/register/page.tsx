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
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { language } = useLanguage();
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

  const copy = {
    title: language === 'zh' ? '注册账号' : 'Create Account',
    desc: language === 'zh' ? '创建您的账号，开始使用 ToolNest 在线工具集' : 'Create your account and start using ToolNest.',
    email: language === 'zh' ? '邮箱' : 'Email',
    nickname: language === 'zh' ? '昵称' : 'Nickname',
    password: language === 'zh' ? '密码' : 'Password',
    confirmPassword: language === 'zh' ? '确认密码' : 'Confirm Password',
    captcha: language === 'zh' ? '验证码' : 'Captcha',
    nicknamePlaceholder: language === 'zh' ? '您的昵称' : 'Your nickname',
    passwordPlaceholder: language === 'zh' ? '至少6位字符' : 'At least 6 characters',
    confirmPlaceholder: language === 'zh' ? '再次输入密码' : 'Enter password again',
    captchaPlaceholder: language === 'zh' ? '请输入验证码' : 'Enter captcha',
    captchaTip: language === 'zh' ? '点击图片可刷新验证码' : 'Click the image to refresh the captcha',
    needAll: language === 'zh' ? '请填写完整信息' : 'Please complete all fields',
    badEmail: language === 'zh' ? '邮箱格式不正确' : 'Invalid email format',
    shortPwd: language === 'zh' ? '密码长度至少6位' : 'Password must be at least 6 characters',
    diffPwd: language === 'zh' ? '两次输入的密码不一致' : 'Passwords do not match',
    needCaptcha: language === 'zh' ? '请输入验证码' : 'Please enter the captcha',
    registerFailed: language === 'zh' ? '注册失败' : 'Registration failed',
    registerRetry: language === 'zh' ? '注册失败，请稍后重试' : 'Registration failed, please try again later',
    invalidEmailTip: language === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email address',
    loading: language === 'zh' ? '注册中...' : 'Registering...',
    submit: language === 'zh' ? '注册' : 'Register',
    hasAccount: language === 'zh' ? '已有账号？' : 'Already have an account?',
    goLogin: language === 'zh' ? '立即登录' : 'Login now',
    pwdStrength: language === 'zh' ? '密码强度' : 'Password strength',
    weak: language === 'zh' ? '弱' : 'Weak',
    medium: language === 'zh' ? '中等' : 'Medium',
    strong: language === 'zh' ? '强' : 'Strong',
    veryStrong: language === 'zh' ? '非常强' : 'Very strong',
    min6: language === 'zh' ? '至少6位' : 'At least 6 chars',
    lower: language === 'zh' ? '小写字母' : 'Lowercase',
    upper: language === 'zh' ? '大写字母' : 'Uppercase',
    number: language === 'zh' ? '数字' : 'Number',
    special: language === 'zh' ? '特殊字符' : 'Special char',
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
  const strengthLabel = score <= 2 ? copy.weak : score <= 3 ? copy.medium : score <= 4 ? copy.strong : copy.veryStrong;
  const strengthColor = score <= 2 ? 'text-red-500' : score <= 3 ? 'text-yellow-500' : 'text-green-500';
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword || !nickname) return setError(copy.needAll);
    if (!isValidEmail) return setError(copy.badEmail);
    if (password.length < 6) return setError(copy.shortPwd);
    if (password !== confirmPassword) return setError(copy.diffPwd);
    if (!captchaCode) return setError(copy.needCaptcha);

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nickname, captchaToken, captchaCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || copy.registerFailed);
        fetchCaptcha();
        return;
      }

      if (data.token && data.user) {
        login(data.token, data.user);
        router.push('/');
        return;
      }

      const captchaRes = await fetch('/api/captcha');
      const captchaData = await captchaRes.json();

      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captchaToken: captchaData.token, captchaCode: captchaData.code || captchaCode }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok && loginData.token) {
        login(loginData.token, loginData.user);
        router.push('/');
      } else {
        router.push('/login');
      }
    } catch {
      setError(copy.registerRetry);
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
              <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={email && !isValidEmail ? 'border-red-500' : ''} />
              {email && !isValidEmail && <p className="text-xs text-red-500">{copy.invalidEmailTip}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">{copy.nickname}</Label>
              <Input id="nickname" type="text" placeholder={copy.nicknamePlaceholder} value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{copy.password}</Label>
              <Input id="password" type="password" placeholder={copy.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} />
              {password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs"><span className={strengthColor}>{copy.pwdStrength}: {strengthLabel}</span></div>
                  <div className="grid grid-cols-5 gap-1">{[1,2,3,4,5].map((level) => <div key={level} className={`h-1 rounded ${score >= level ? score <= 2 ? 'bg-red-500' : score <= 3 ? 'bg-yellow-500' : 'bg-green-500' : 'bg-gray-200'}`} />)}</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">{checks.length ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-gray-300" />}{copy.min6}</span>
                    <span className="flex items-center gap-1">{checks.hasLower ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-gray-300" />}{copy.lower}</span>
                    <span className="flex items-center gap-1">{checks.hasUpper ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-gray-300" />}{copy.upper}</span>
                    <span className="flex items-center gap-1">{checks.hasNumber ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-gray-300" />}{copy.number}</span>
                    <span className="flex items-center gap-1">{checks.hasSpecial ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-gray-300" />}{copy.special}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{copy.confirmPassword}</Label>
              <Input id="confirmPassword" type="password" placeholder={copy.confirmPlaceholder} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={confirmPassword && password !== confirmPassword ? 'border-red-500' : ''} />
              {confirmPassword && password !== confirmPassword && <p className="text-xs text-red-500">{copy.diffPwd}</p>}
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
            <p className="text-sm text-muted-foreground">{copy.hasAccount}{' '}<Link href="/login" className="text-primary hover:underline">{copy.goLogin}</Link></p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
