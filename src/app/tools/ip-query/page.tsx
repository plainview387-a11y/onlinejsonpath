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

  // 获取当前IP
  const fetchCurrentIP = async () => {
    setLoadingCurrent(true);
    setError('');
    try {
      const response = await fetch('/api/ip-query');
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || '获取当前IP失败');
        return;
      }
      
      setCurrentIP(data.data);
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoadingCurrent(false);
    }
  };

  // 查询指定IP
  const querySpecificIP = async () => {
    if (!ipInput.trim()) {
      setError('请输入IP地址');
      return;
    }

    if (!isValidIPv4(ipInput)) {
      setError('IP格式不正确，请输入正确的IPv4地址');
      return;
    }

    setLoadingQuery(true);
    setError('');
    try {
      const response = await fetch(`/api/ip-query?ip=${encodeURIComponent(ipInput.trim())}`);
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || '查询IP失败');
        return;
      }
      
      setQueryIP(data.data);
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoadingQuery(false);
    }
  };

  // 表格展示组件
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
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {rows.map((row, index) => (
                  <tr 
                    key={row.label} 
                    className={`${index < rows.length - 1 ? 'border-b' : ''} hover:bg-muted/50 transition-colors`}
                  >
                    <td className="py-3 px-4 font-medium text-muted-foreground w-32">
                      {row.label}
                    </td>
                    <td className="py-3 px-4">
                      {row.value || '-'}
                    </td>
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
    <ToolLayout
      title="IP 查询工具"
      description="查询当前IP地址信息或指定IP地址的地理位置"
    >
      <div className="space-y-6">
        {/* 错误提示 */}
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {/* 获取当前IP */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">获取当前IP地址信息</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={fetchCurrentIP} 
              disabled={loadingCurrent}
              className="w-full md:w-auto"
            >
              {loadingCurrent ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  查询中...
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  获取我的IP信息
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 当前IP信息表格 */}
        {currentIP && <IPTable data={currentIP} title="当前IP地址信息" />}

        {/* 查询指定IP */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">查询指定IP地址信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="ip-input">IP地址</Label>
                <Input
                  id="ip-input"
                  type="text"
                  placeholder="请输入IPv4地址，例如：119.123.72.166"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && querySpecificIP()}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={querySpecificIP} 
                  disabled={loadingQuery}
                  className="w-full md:w-auto"
                >
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
            <p className="text-xs text-muted-foreground">
              支持IPv4地址查询，例如：119.123.72.166、8.8.8.8
            </p>
          </CardContent>
        </Card>

        {/* 查询IP信息表格 */}
        {queryIP && <IPTable data={queryIP} title={`IP地址 ${queryIP.ip} 的信息`} />}

        {/* 使用说明 */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>点击&quot;获取我的IP信息&quot;可查询您当前的IP地址及位置信息</li>
              <li>在输入框中输入任意IPv4地址，点击&quot;查询&quot;可获取该IP的位置信息</li>
              <li>查询结果包含：国家、省份、城市、运营商等详细信息</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* 评论区 */}
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">工具说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>IP 查询工具支持查看当前 IP 或指定 IP 的归属地、运营商和地理位置信息，适合网络排查、登录风险判断和安全分析。</p>
            <p>如果你在处理访问日志、风控记录或用户来源判断，这个工具可以帮助你快速得到基础网络信息。</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">常见问题</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p><strong>Q：</strong>为什么定位不是特别精确？<br /><strong>A：</strong>IP 查询通常只能定位到运营商或城市级别，不能保证精确到具体地址。</p>
            <p><strong>Q：</strong>适合哪些场景？<br /><strong>A：</strong>登录风险排查、服务访问来源分析、接口调试和运营数据核对都很常见。</p>
          </CardContent>
        </Card>
      </div>

      <CommentSection pageKey="ip-query" />
    </ToolLayout>
  );
}
