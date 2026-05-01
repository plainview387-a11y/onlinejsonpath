'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CommentSection } from '@/components/CommentSection';

export default function TimestampPage() {
  const [timestamp, setTimestamp] = useState('');
  const [datetime, setDatetime] = useState('');
  const [isMilliseconds, setIsMilliseconds] = useState(false);
  const [currentTime, setCurrentTime] = useState({
    timestamp: 0,
    datetime: '',
  });

  // 更新当前时间
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const ts = now.getTime();
      setCurrentTime({
        timestamp: ts,
        datetime: formatDateTime(now),
      });
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 格式化日期时间
  const formatDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // 时间戳转日期
  const timestampToDate = () => {
    if (!timestamp) return;
    
    try {
      let ts = parseInt(timestamp);
      if (isMilliseconds) {
        ts = ts;
      } else {
        ts = ts * 1000; // 转换为毫秒
      }
      const date = new Date(ts);
      setDatetime(formatDateTime(date));
    } catch {
      // 忽略错误
    }
  };

  // 日期转时间戳
  const dateToTimestamp = () => {
    if (!datetime) return;
    
    try {
      const date = new Date(datetime);
      let ts = date.getTime();
      if (!isMilliseconds) {
        ts = Math.floor(ts / 1000); // 转换为秒
      }
      setTimestamp(String(ts));
    } catch {
      // 忽略错误
    }
  };

  // 使用当前时间
  const useCurrentTime = () => {
    setTimestamp(isMilliseconds ? String(currentTime.timestamp) : String(Math.floor(currentTime.timestamp / 1000)));
    setDatetime(currentTime.datetime);
  };

  return (
    <ToolLayout
      title="Unix 时间戳转换工具"
      description="时间戳与日期时间互转，支持秒级和毫秒级"
    >
      <div className="space-y-4">
        {/* 当前时间显示 */}
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">当前时间</p>
                <p className="text-xl font-mono">{currentTime.datetime}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">时间戳</p>
                <p className="text-xl font-mono">
                  {isMilliseconds ? currentTime.timestamp : Math.floor(currentTime.timestamp / 1000)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 单位切换 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">时间戳单位</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="milliseconds"
                checked={isMilliseconds}
                onCheckedChange={setIsMilliseconds}
              />
              <Label htmlFor="milliseconds">
                {isMilliseconds ? '毫秒级 (ms)' : '秒级 (s)'}
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* 转换区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 时间戳输入 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">时间戳</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="number"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder={`输入${isMilliseconds ? '毫秒' : '秒'}级时间戳`}
                className="font-mono"
              />
              <div className="flex gap-2">
                <Button onClick={timestampToDate} className="flex-1">
                  转换为日期 →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 日期时间输入 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">日期时间</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="datetime-local"
                value={datetime.replace(' ', 'T')}
                onChange={(e) => setDatetime(e.target.value.replace('T', ' '))}
                className="font-mono"
                step="1"
              />
              <div className="flex gap-2">
                <Button onClick={dateToTimestamp} className="flex-1">
                  ← 转换为时间戳
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 快捷操作 */}
        <div className="flex justify-center">
          <Button onClick={useCurrentTime} variant="outline">
            使用当前时间
          </Button>
        </div>
      </div>

      {/* 评论区 */}
      <CommentSection pageKey="timestamp" />
    </ToolLayout>
  );
}
