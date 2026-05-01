import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { verifyToken } from '@/lib/auth';
import { listLocalUserComments } from '@/lib/local-comment-store';

function isSupabaseConfigError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('Supabase');
}

interface UserCommentRecord {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  page_key: string;
  parent_id: string | null;
}

// GET: 获取当前用户的历史评论
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: '登录已过期' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    const offset = (page - 1) * pageSize;
    let client;
    try {
      client = getSupabaseClient();
    } catch (error) {
      if (isSupabaseConfigError(error)) {
        return NextResponse.json({
          success: true,
          data: listLocalUserComments(decoded.userId, page, pageSize),
          mode: 'local',
        });
      }
      throw error;
    }

    // 获取用户评论总数
    const { count, error: countError } = await client
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', decoded.userId);

    if (countError) {
      console.error('Get user comments count error:', countError);
      return NextResponse.json(
        { error: '获取评论失败' },
        { status: 500 }
      );
    }

    // 获取用户评论列表
    const { data: comments, error } = await client
      .from('comments')
      .select('id, content, created_at, updated_at, user_id, page_key, parent_id')
      .eq('user_id', decoded.userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error('Get user comments error:', error);
      return NextResponse.json(
        { error: '获取评论失败' },
        { status: 500 }
      );
    }

    // 页面名称映射
    const pageNames: Record<string, string> = {
      'jsonpath': 'JSONPath 解析',
      'base64': 'Base64 加解密',
      'timestamp': '时间戳转换',
      'json-escape': 'JSON 转义',
      'text-stats': '文本统计',
      'image-base64': '图片 Base64',
      'ip-query': 'IP 查询',
    };

    // 格式化返回数据
    const formattedComments = (comments as UserCommentRecord[] | null)?.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      pageKey: comment.page_key,
      pageName: pageNames[comment.page_key] || comment.page_key,
      isReply: !!comment.parent_id,
    })) || [];

    return NextResponse.json({
      success: true,
      data: {
        comments: formattedComments,
        pagination: {
          page,
          pageSize,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('Get user comments error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
