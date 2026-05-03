'use client';

import { useMemo, useState, useEffect } from 'react';
import { ToolLayout, ActionButtons } from '@/components/ToolComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { CommentSection } from '@/components/CommentSection';

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function toLocalDateTimeInput(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatDateTime(date: Date, useUtc: boolean): string {
  const year = useUtc ? date.getUTCFullYear() : date.getFullYear();
  const month = useUtc ? date.getUTCMonth() + 1 : date.getMonth() + 1;
  const day = useUtc ? date.getUTCDate() : date.getDate();
  const hours = useUtc ? date.getUTCHours() : date.getHours();
  const minutes = useUtc ? date.getUTCMinutes() : date.getMinutes();
  const seconds = useUtc ? date.getUTCSeconds() : date.getSeconds();
  return `${year}-${pad(month)}-${pad(day)} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function parseDateTime(value: string, useUtc: boolean): Date | null {
  if (!value.trim()) return null;
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  if (useUtc) {
    const utcValue = normalized.endsWith('Z') ? normalized : `${normalized}Z`;
    const date = new Date(utcValue);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function detectTimestampUnit(value: string): 'seconds' | 'milliseconds' | null {
  const raw = value.trim();
  if (!/^\d+$/.test(raw)) return null;
  if (raw.length >= 13) return 'milliseconds';
  if (raw.length >= 10) return 'seconds';
  return null;
}

export default function TimestampPage() {
  const [timestamp, setTimestamp] = useState('');
  const [datetime, setDatetime] = useState('');
  const [isMilliseconds, setIsMilliseconds] = useState(false);
  const [useUtc, setUseUtc] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState({
    timestamp: 0,
    localDisplay: '',
    utcDisplay: '',
    inputValue: '',
  });

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentTime({
        timestamp: now.getTime(),
        localDisplay: formatDateTime(now, false),
        utcDisplay: formatDateTime(now, true),
        inputValue: toLocalDateTimeInput(now),
      });
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentTimestampDisplay = isMilliseconds
    ? String(currentTime.timestamp)
    : String(Math.floor(currentTime.timestamp / 1000));

  const activeCurrentDisplay = useUtc ? currentTime.utcDisplay : currentTime.localDisplay;

  const timestampHint = useMemo(() => {
    const unit = detectTimestampUnit(timestamp);
    if (!unit) return '支持自动识别 10 位秒级 / 13 位毫秒级';
    return unit === 'milliseconds' ? '检测到毫秒级时间戳' : '检测到秒级时间戳';
  }, [timestamp]);

  const timestampToDate = () => {
    if (!timestamp.trim()) {
      setError('请输入时间戳');
      return;
    }

    if (!/^-?\d+$/.test(timestamp.trim())) {
      setError('时间戳必须是整数');
      return;
    }

    let ts = Number(timestamp.trim());
    if (!Number.isFinite(ts)) {
      setError('时间戳无效');
      return;
    }

    const detected = detectTimestampUnit(timestamp);
    const shouldUseMilliseconds = detected ? detected === 'milliseconds' : isMilliseconds;
    if (!shouldUseMilliseconds) ts *= 1000;

    const date = new Date(ts);
    if (Number.isNaN(date.getTime())) {
      setError('无法解析该时间戳');
      return;
    }

    setError('');
    setIsMilliseconds(shouldUseMilliseconds);
    setDatetime(toLocalDateTimeInput(date));
  };

  const dateToTimestamp = () => {
    const date = parseDateTime(datetime, useUtc);
    if (!date) {
      setError(`请输入有效的${useUtc ? ' UTC' : ''}日期时间`);
      return;
    }

    setError('');
    const next = isMilliseconds ? date.getTime() : Math.floor(date.getTime() / 1000);
    setTimestamp(String(next));
  };

  const useCurrentTime = () => {
    setError('');
    setTimestamp(currentTimestampDisplay);
    setDatetime(currentTime.inputValue);
  };

  const clearAll = () => {
    setTimestamp('');
    setDatetime('');
    setError('');
  };

  const copyTimestamp = async () => {
    if (!timestamp) return;
    await navigator.clipboard.writeText(timestamp);
    toast.success('时间戳已复制');
  };

  const copyDatetime = async () => {
    if (!datetime) return;
    await navigator.clipboard.writeText(datetime.replace('T', ' '));
    toast.success('日期时间已复制');
  };

  return (
    <ToolLayout title="Unix 时间戳转换工具" description="时间戳与日期时间互转，支持秒级、毫秒级、本地时间与 UTC 时间">
      <div className="space-y-4">
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">当前时间（{useUtc ? 'UTC' : '本地'}）</p>
                <p className="text-xl font-mono">{activeCurrentDisplay}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-muted-foreground">当前时间戳</p>
                <p className="text-xl font-mono">{currentTimestampDisplay}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">转换设置</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:gap-8">
              <div className="flex items-center space-x-2">
                <Switch id="milliseconds" checked={isMilliseconds} onCheckedChange={setIsMilliseconds} />
                <Label htmlFor="milliseconds">{isMilliseconds ? '毫秒级 (ms)' : '秒级 (s)'}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="utc" checked={useUtc} onCheckedChange={setUseUtc} />
                <Label htmlFor="utc">{useUtc ? 'UTC 时间' : '本地时间'}</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg">时间戳</CardTitle>
                <ActionButtons onCopy={copyTimestamp} onClear={clearAll} value={timestamp} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                inputMode="numeric"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder={`输入${isMilliseconds ? '毫秒' : '秒'}级时间戳`}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">{timestampHint}</p>
              <Button onClick={timestampToDate} className="w-full">转换为日期时间 →</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg">日期时间</CardTitle>
                <ActionButtons onCopy={copyDatetime} onClear={clearAll} value={datetime} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="datetime-local"
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                className="font-mono"
                step="1"
              />
              <p className="text-xs text-muted-foreground">{useUtc ? '按 UTC 时间解释输入值' : '按本地时区解释输入值'}</p>
              <Button onClick={dateToTimestamp} className="w-full">← 转换为时间戳</Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-2">
          <Button onClick={useCurrentTime} variant="outline">使用当前时间</Button>
          <Button onClick={clearAll} variant="ghost">清空输入</Button>
        </div>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">工具说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>这个工具适合开发调试、日志排查和接口联调时快速完成 Unix 时间戳与日期时间的双向转换。</p>
            <p>页面支持秒级与毫秒级切换、自动识别常见位数，也支持本地时间与 UTC 的区别查看。</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">常见问题</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p><strong>Q：</strong>为什么会差 8 小时？<br /><strong>A：</strong>通常是本地时间和 UTC 时间理解不一致，建议确认当前切换的是哪种时区解释。</p>
            <p><strong>Q：</strong>秒级和毫秒级怎么区分？<br /><strong>A：</strong>10 位通常是秒级，13 位通常是毫秒级，本页也会自动给出识别提示。</p>
          </CardContent>
        </Card>
      </div>

      <CommentSection pageKey="timestamp" />
    </ToolLayout>
  );
}
