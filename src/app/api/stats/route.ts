import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
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
    console.error('Get stats error:', error);
    return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 });
  }
}
