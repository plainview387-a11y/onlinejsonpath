'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Globe, Search } from 'lucide-react';
import { CommentSection } from '@/components/CommentSection';

interface IPInfo {
  ip: string;
  country: string;
  province: string;
  provinceId: number;
  city: string;
  cityId: number;
  isp: string;
  desc: string;
}

function isValidIPv4(ip: string): boolean {
  const parts = ip.trim().split('.');
  return (
    parts.length === 4 &&
    parts.every((part) => {
      if (!/^\d+$/.test(part)) return false;
      const value = Number(part);
      return value >= 0 && value <= 255 && String(value) === part.replace(/^0+(?=\d)/, '');
    })
  );
}

export default function IPQueryPage() {
  const [ipInput, setIpInput] = useState('');
  const [currentIP, setCurrentIP] = useState<IPInfo | null>(null);
  const [queryIP, setQueryIP] = useState<IPInfo | null>(null);
  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const [loadingQuery, setLoadingQuery] = useState(false);
  const [error, setError] = useState('');

  const fetchCurrentIP = async () => {
    setLoadingCurrent(true);
    setError('');
    try {
      const response = await fetch('/api/ip-query');
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '获取当前 IP 失败');
        return;
      }

      setCurrentIP(data.data);
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoadingCurrent(false);
    }
  };

  const querySpecificIP = async () => {
    if (!ipInput.trim()) {
      setError('请输入 IP 地址');
      return;
    }

    if (!isValidIPv4(ipInput)) {
      setError('IP 格式不正确，请输入正确的 IPv4 地址');
      return;
    }

    setLoadingQuery(true);
    setError('');
    try {
      const response = await fetch(`/api/ip-query?ip=${encodeURIComponent(ipInput.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '查询 IP 失败');
        return;
      }

      setQueryIP(data.data);
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoadingQuery(false);
    }
  };

  const IPTable = ({ data, title }: { data: IPInfo | null; title: string }) => {
    if (!data) return null;

    const rows = [
      { label: 'IP地址', value: data.ip },
      { label: '国家/地区', value: data.country },
      { label: '省份', value: data.province },
      { label: '省份代码', value: data.provinceId?.toString() || '-' },
      { label: '城市', value: data.city },
      { label: '城市代码', value: data.cityId?.toString() || '-' },
      { label: '运营商', value: data.isp },
      { label: '详细描述', value: data.desc },
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.label} className={`${index < rows.length - 1 ? 'border-b' : ''} transition-colors hover:bg-muted/50`}>
                    <td className="w-32 px-4 py-3 font-medium text-muted-foreground">{row.label}</td>
                    <td className="px-4 py-3">{row.value || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <ToolLayout title="IP 查询工具" description="查询当前 IP 地址信息或指定 IP 地址的地理位置">
      <div className="space-y-6">
        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">获取当前 IP 地址信息</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchCurrentIP} disabled={loadingCurrent} className="w-full md:w-auto">
              {loadingCurrent ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  查询中...
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  获取我的 IP 信息
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {currentIP && <IPTable data={currentIP} title="当前 IP 地址信息" />}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">查询指定 IP 地址信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1 space-y-2">
                <Label htmlFor="ip-input">IP 地址</Label>
                <Input
                  id="ip-input"
                  type="text"
                  placeholder="请输入 IPv4 地址，例如：119.123.72.166"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && querySpecificIP()}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={querySpecificIP} disabled={loadingQuery} className="w-full md:w-auto">
                  {loadingQuery ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      查询中...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      查询
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {queryIP && <IPTable data={queryIP} title="指定 IP 地址信息" />}
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">工具说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>这个工具适合做网络排查、接口调试和地理位置快速判断。你可以直接查询当前 IP，也可以手动输入指定 IPv4 地址。</p>
            <p>查询请求会发送到服务端接口，再由服务端向上游数据源获取结果，具体准确度取决于 IP 地理库本身。</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">隐私与注意事项</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p><strong>隐私：</strong>点击“获取我的 IP 信息”时，服务端会处理当前请求来源地址并返回地理归属信息。</p>
            <p><strong>限制：</strong>IP 地理位置只能用于近似判断，不代表精确物理定位；如果上游服务限流或异常，页面也可能查询失败。</p>
          </CardContent>
        </Card>
      </div>

      <CommentSection pageKey="ip-query" />
    </ToolLayout>
  );
}
