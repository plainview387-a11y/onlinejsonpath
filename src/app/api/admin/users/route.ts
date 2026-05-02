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
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const offset = (page - 1) * pageSize;

    const [{ count }, { data, error }] = await Promise.all([
      client.from('users').select('*', { count: 'exact', head: true }),
      client
        .from('users')
        .select('id, email, nickname, avatar, created_at')
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1),
    ]);

    if (error) {
      return NextResponse.json({ error: '获取用户列表失败' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        users: data || [],
        pagination: {
          page,
          pageSize,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
