import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { isAdminEmail } from '@/lib/admin';
import { getRequestUser } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });
  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: '无权限访问' }, { status: 403 });
  }

  try {
    const client = getSupabaseClient();
    const [{ count: userCount }, { count: commentCount }, { data: toolRows }] = await Promise.all([
      client.from('users').select('*', { count: 'exact', head: true }),
      client.from('comments').select('*', { count: 'exact', head: true }),
      client.from('comments').select('page_key'),
    ]);

    const toolUsage = (toolRows || []).reduce<Record<string, number>>((acc, row) => {
      const key = row.page_key || 'unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        userCount: userCount || 0,
        commentCount: commentCount || 0,
        toolUsage,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 });
  }
}
