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
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { language } = useLanguage();
  const [timestamp, setTimestamp] = useState('');
  const [datetime, setDatetime] = useState('');
  const [isMilliseconds, setIsMilliseconds] = useState(false);
  const [useUtc, setUseUtc] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState({ timestamp: 0, localDisplay: '', utcDisplay: '', inputValue: '' });

  const copy = {
    title: language === 'zh' ? 'Unix 时间戳转换工具' : 'Unix Timestamp Converter',
    desc: language === 'zh' ? '时间戳与日期时间互转，支持秒级、毫秒级、本地时间与 UTC 时间' : 'Convert between timestamps and date-time with support for seconds, milliseconds, local time, and UTC.',
    currentTime: language === 'zh' ? '当前时间' : 'Current Time',
    currentTimestamp: language === 'zh' ? '当前时间戳' : 'Current Timestamp',
    utc: 'UTC',
    local: language === 'zh' ? '本地' : 'Local',
    settings: language === 'zh' ? '转换设置' : 'Conversion Settings',
    ms: language === 'zh' ? '毫秒级 (ms)' : 'Milliseconds (ms)',
    sec: language === 'zh' ? '秒级 (s)' : 'Seconds (s)',
    utcTime: language === 'zh' ? 'UTC 时间' : 'UTC Time',
    localTime: language === 'zh' ? '本地时间' : 'Local Time',
    inputTs: language === 'zh' ? '时间戳' : 'Timestamp',
    inputDate: language === 'zh' ? '日期时间' : 'Date Time',
    inputTsPlaceholder: language === 'zh' ? `输入${isMilliseconds ? '毫秒' : '秒'}级时间戳` : `Enter ${isMilliseconds ? 'millisecond' : 'second'} timestamp`,
    convertToDate: language === 'zh' ? '转换为日期时间 →' : 'Convert to Date Time →',
    convertToTs: language === 'zh' ? '← 转换为时间戳' : '← Convert to Timestamp',
    useCurrent: language === 'zh' ? '使用当前时间' : 'Use Current Time',
    clear: language === 'zh' ? '清空输入' : 'Clear Input',
    enterTs: language === 'zh' ? '请输入时间戳' : 'Please enter a timestamp',
    tsInt: language === 'zh' ? '时间戳必须是整数' : 'Timestamp must be an integer',
    tsInvalid: language === 'zh' ? '时间戳无效' : 'Invalid timestamp',
    tsParse: language === 'zh' ? '无法解析该时间戳' : 'Unable to parse this timestamp',
    dateInvalid: language === 'zh' ? `请输入有效的${useUtc ? ' UTC' : ''}日期时间` : `Please enter a valid${useUtc ? ' UTC' : ''} date time`,
    tsCopied: language === 'zh' ? '时间戳已复制' : 'Timestamp copied',
    dateCopied: language === 'zh' ? '日期时间已复制' : 'Date time copied',
    hintAuto: language === 'zh' ? '支持自动识别 10 位秒级 / 13 位毫秒级' : 'Auto-detects 10-digit seconds / 13-digit milliseconds',
    hintMs: language === 'zh' ? '检测到毫秒级时间戳' : 'Detected millisecond timestamp',
    hintSec: language === 'zh' ? '检测到秒级时间戳' : 'Detected second timestamp',
    utcExplain: language === 'zh' ? '按 UTC 时间解释输入值' : 'Interpret input as UTC time',
    localExplain: language === 'zh' ? '按本地时区解释输入值' : 'Interpret input in local timezone',
    toolDesc: language === 'zh' ? '工具说明' : 'About this tool',
    faq: language === 'zh' ? '常见问题' : 'FAQ',
    t1: language === 'zh' ? '这个工具适合开发调试、日志排查和接口联调时快速完成 Unix 时间戳与日期时间的双向转换。' : 'This tool is useful for development debugging, log inspection, and API work where you need quick conversion between Unix timestamps and date time.',
    t2: language === 'zh' ? '页面支持秒级与毫秒级切换、自动识别常见位数，也支持本地时间与 UTC 的区别查看。' : 'It supports switching between seconds and milliseconds, auto-detects common digit lengths, and helps compare local time with UTC.',
    q1: language === 'zh' ? '为什么会差 8 小时？' : 'Why is there an 8-hour difference?',
    a1: language === 'zh' ? '通常是本地时间和 UTC 时间理解不一致，建议确认当前切换的是哪种时区解释。' : 'Usually local time and UTC are being interpreted differently. Check which timezone mode is currently selected.',
    q2: language === 'zh' ? '秒级和毫秒级怎么区分？' : 'How do I distinguish seconds from milliseconds?',
    a2: language === 'zh' ? '10 位通常是秒级，13 位通常是毫秒级，本页也会自动给出识别提示。' : '10 digits are usually seconds and 13 digits are usually milliseconds. This page also shows an auto-detection hint.',
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentTime({ timestamp: now.getTime(), localDisplay: formatDateTime(now, false), utcDisplay: formatDateTime(now, true), inputValue: toLocalDateTimeInput(now) });
    };
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentTimestampDisplay = isMilliseconds ? String(currentTime.timestamp) : String(Math.floor(currentTime.timestamp / 1000));
  const activeCurrentDisplay = useUtc ? currentTime.utcDisplay : currentTime.localDisplay;

  const timestampHint = useMemo(() => {
    const unit = detectTimestampUnit(timestamp);
    if (!unit) return copy.hintAuto;
    return unit === 'milliseconds' ? copy.hintMs : copy.hintSec;
  }, [timestamp, copy.hintAuto, copy.hintMs, copy.hintSec]);

  const timestampToDate = () => {
    if (!timestamp.trim()) return setError(copy.enterTs);
    if (!/^-?\d+$/.test(timestamp.trim())) return setError(copy.tsInt);
    let ts = Number(timestamp.trim());
    if (!Number.isFinite(ts)) return setError(copy.tsInvalid);
    const detected = detectTimestampUnit(timestamp);
    const shouldUseMilliseconds = detected ? detected === 'milliseconds' : isMilliseconds;
    if (!shouldUseMilliseconds) ts *= 1000;
    const date = new Date(ts);
    if (Number.isNaN(date.getTime())) return setError(copy.tsParse);
    setError('');
    setIsMilliseconds(shouldUseMilliseconds);
    setDatetime(toLocalDateTimeInput(date));
  };

  const dateToTimestamp = () => {
    const date = parseDateTime(datetime, useUtc);
    if (!date) return setError(copy.dateInvalid);
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
    toast.success(copy.tsCopied);
  };

  const copyDatetime = async () => {
    if (!datetime) return;
    await navigator.clipboard.writeText(datetime.replace('T', ' '));
    toast.success(copy.dateCopied);
  };

  return (
    <ToolLayout title={copy.title} description={copy.desc}>
      <div className="space-y-4">
        <Card className="bg-primary/5"><CardContent className="pt-6"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><p className="text-sm text-muted-foreground">{copy.currentTime}（{useUtc ? copy.utc : copy.local}）</p><p className="font-mono text-xl">{activeCurrentDisplay}</p></div><div className="text-left md:text-right"><p className="text-sm text-muted-foreground">{copy.currentTimestamp}</p><p className="font-mono text-xl">{currentTimestampDisplay}</p></div></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-lg">{copy.settings}</CardTitle></CardHeader><CardContent><div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:gap-8"><div className="flex items-center space-x-2"><Switch id="milliseconds" checked={isMilliseconds} onCheckedChange={setIsMilliseconds} /><Label htmlFor="milliseconds">{isMilliseconds ? copy.ms : copy.sec}</Label></div><div className="flex items-center space-x-2"><Switch id="utc" checked={useUtc} onCheckedChange={setUseUtc} /><Label htmlFor="utc">{useUtc ? copy.utcTime : copy.localTime}</Label></div></div></CardContent></Card>
        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card><CardHeader><div className="flex items-center justify-between gap-3"><CardTitle className="text-lg">{copy.inputTs}</CardTitle><ActionButtons onCopy={copyTimestamp} onClear={clearAll} value={timestamp} /></div></CardHeader><CardContent className="space-y-4"><Input type="text" inputMode="numeric" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} placeholder={copy.inputTsPlaceholder} className="font-mono" /><p className="text-xs text-muted-foreground">{timestampHint}</p><Button onClick={timestampToDate} className="w-full">{copy.convertToDate}</Button></CardContent></Card>
          <Card><CardHeader><div className="flex items-center justify-between gap-3"><CardTitle className="text-lg">{copy.inputDate}</CardTitle><ActionButtons onCopy={copyDatetime} onClear={clearAll} value={datetime} /></div></CardHeader><CardContent className="space-y-4"><Input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} className="font-mono" step="1" /><p className="text-xs text-muted-foreground">{useUtc ? copy.utcExplain : copy.localExplain}</p><Button onClick={dateToTimestamp} className="w-full">{copy.convertToTs}</Button></CardContent></Card>
        </div>
        <div className="flex justify-center gap-2"><Button onClick={useCurrentTime} variant="outline">{copy.useCurrent}</Button><Button onClick={clearAll} variant="ghost">{copy.clear}</Button></div>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-lg">{copy.toolDesc}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-7 text-muted-foreground"><p>{copy.t1}</p><p>{copy.t2}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-lg">{copy.faq}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-7 text-muted-foreground"><p><strong>Q：</strong>{copy.q1}<br /><strong>A：</strong>{copy.a1}</p><p><strong>Q：</strong>{copy.q2}<br /><strong>A：</strong>{copy.a2}</p></CardContent></Card>
      </div>

      <CommentSection pageKey="timestamp" />
    </ToolLayout>
  );
}
