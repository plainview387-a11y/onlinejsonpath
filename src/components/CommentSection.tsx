'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  CornerDownRight,
  Heart,
  History,
  Loader2,
  MessageCircle,
  MessageSquare,
  Send,
  SmilePlus,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    nickname: string;
    avatar: string;
  };
  replies?: Comment[];
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface CommentSectionProps {
  pageKey: string;
}

type SortMode = 'hot' | 'new';

interface HistoryComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  pageKey: string;
  pageName: string;
  isReply: boolean;
}

const MAX_COMMENT_LENGTH = 500;
const INITIAL_REPLY_COUNT = 2;

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function getInitial(name?: string) {
  return name?.trim().slice(0, 1).toUpperCase() || 'U';
}

function readStoredUser() {
  if (typeof window === 'undefined') return null;

  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as { id: string; nickname: string; avatar: string };
  } catch {
    return null;
  }
}

function getLocalLikesKey(pageKey: string) {
  return `comment-liked:${pageKey}`;
}

function HistoryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [comments, setComments] = useState<HistoryComment[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 5,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchMyComments = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `/api/comments/my-comments?page=${page}&pageSize=${pagination.pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();

      if (data.success) {
        setComments(data.data.comments);
        setPagination(data.data.pagination);
      } else {
        toast.error(data.error || '获取历史评论失败');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize]);

  useEffect(() => {
    if (isOpen) {
      fetchMyComments(1);
    }
  }, [isOpen, fetchMyComments]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <Card className="max-h-[82vh] w-full overflow-hidden rounded-b-none border-0 shadow-2xl sm:max-w-2xl sm:rounded-lg sm:border">
        <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4" />
            我的评论
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="max-h-[68vh] overflow-y-auto p-0">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              加载中
            </div>
          ) : comments.length > 0 ? (
            <div>
              {comments.map((comment) => (
                <div key={comment.id} className="border-b px-4 py-4 last:border-b-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="h-5 rounded-full px-2 text-[11px]">
                      {comment.pageName}
                    </Badge>
                    {comment.isReply && (
                      <span className="flex items-center gap-1">
                        <CornerDownRight className="h-3 w-3" />
                        回复
                      </span>
                    )}
                    <span>{formatTime(comment.createdAt)}</span>
                  </div>
                  <p className="break-words text-sm leading-6 whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))}

              {pagination.totalPages > 1 && (
                <div className="sticky bottom-0 flex items-center justify-center gap-2 border-t bg-card/95 p-3 backdrop-blur">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fetchMyComments(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="min-w-14 text-center text-xs text-muted-foreground">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fetchMyComments(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <MessageSquare className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p className="text-sm">暂无评论记录</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CommentAvatar({
  user,
  size = 'md',
}: {
  user: Comment['user'];
  size?: 'sm' | 'md';
}) {
  return (
    <Avatar className={cn(size === 'sm' ? 'h-7 w-7' : 'h-9 w-9', 'border bg-muted')}>
      <AvatarImage src={user.avatar || undefined} alt={user.nickname} />
      <AvatarFallback className="text-xs font-medium">{getInitial(user.nickname)}</AvatarFallback>
    </Avatar>
  );
}

function CommentItem({
  comment,
  onReply,
  onLike,
  liked,
  likeCount,
  isReply = false,
}: {
  comment: Comment;
  onReply: (comment: Comment) => void;
  onLike: (commentId: string) => void;
  liked: boolean;
  likeCount: number;
  isReply?: boolean;
}) {
  return (
    <div className={cn('group flex gap-3', isReply && 'gap-2')}>
      <CommentAvatar user={comment.user} size={isReply ? 'sm' : 'md'} />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground/90">
            {comment.user.nickname}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatTime(comment.createdAt)}
          </span>
        </div>
        <p className="mt-1 break-words text-sm leading-6 text-foreground/85 whitespace-pre-wrap">
          {comment.content}
        </p>
        <div className="mt-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 rounded-full px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onReply(comment)}
          >
            <MessageSquare className="mr-1 h-3.5 w-3.5" />
            回复
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 rounded-full px-2 text-xs text-muted-foreground hover:text-foreground',
              liked && 'text-rose-500 hover:text-rose-500',
            )}
            onClick={() => onLike(comment.id)}
          >
            <Heart className={cn('mr-1 h-3.5 w-3.5', liked && 'fill-current')} />
            {likeCount > 0 ? likeCount : '赞'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CommentSection({ pageKey }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 8,
    total: 0,
    totalPages: 0,
  });
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<{ id: string; nickname: string; avatar: string } | null>(null);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('hot');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setUser(readStoredUser());
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(getLocalLikesKey(pageKey));
    if (saved) {
      try {
        setLikedIds(new Set(JSON.parse(saved)));
      } catch {
        setLikedIds(new Set());
      }
    } else {
      setLikedIds(new Set());
    }
  }, [pageKey]);

  const fetchComments = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/comments?pageKey=${pageKey}&page=${page}&pageSize=${pagination.pageSize}`,
      );
      const data = await res.json();

      if (data.success) {
        setComments(data.data.comments);
        setPagination(data.data.pagination);
      } else {
        toast.error(data.error || '获取评论失败');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setLoading(false);
    }
  }, [pageKey, pagination.pageSize]);

  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  const sortedComments = useMemo(() => {
    const next = [...comments];
    if (sortMode === 'new') {
      return next.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return next.sort((a, b) => {
      const aScore = (a.replies?.length || 0) * 2 + (likedIds.has(a.id) ? 1 : 0);
      const bScore = (b.replies?.length || 0) * 2 + (likedIds.has(b.id) ? 1 : 0);
      if (bScore !== aScore) return bScore - aScore;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [comments, likedIds, sortMode]);

  const handleSubmit = async () => {
    if (!user) {
      toast.error('请先登录');
      return;
    }

    if (!content.trim()) {
      toast.error('请输入评论内容');
      return;
    }

    if (content.length > MAX_COMMENT_LENGTH) {
      toast.error(`评论内容不能超过${MAX_COMMENT_LENGTH}字`);
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pageKey,
          content: content.trim(),
          parentId: replyingTo?.id || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(replyingTo ? '回复发布成功' : '评论发布成功');
        setContent('');
        setReplyingTo(null);
        setSortMode('new');
        fetchComments(replyingTo ? pagination.page : 1);
      } else {
        toast.error(data.error || '评论发布失败');
      }
    } catch {
      toast.error('网络错误');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (comment: Comment) => {
    if (!user) {
      toast.error('请先登录');
      return;
    }

    setReplyingTo(comment);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      document.getElementById('comment-input')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const toggleLike = (commentId: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      localStorage.setItem(getLocalLikesKey(pageKey), JSON.stringify([...next]));
      return next;
    });
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchComments(page);
  };

  const remaining = MAX_COMMENT_LENGTH - content.length;

  return (
    <>
      <Card className="mt-6 overflow-hidden border bg-card shadow-sm">
        <CardHeader className="border-b px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <MessageCircle className="h-5 w-5" />
              评论
              <span className="text-sm font-normal text-muted-foreground">
                {pagination.total} 条
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex rounded-full bg-muted p-1">
                <Button
                  variant={sortMode === 'hot' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 rounded-full px-3 text-xs"
                  onClick={() => setSortMode('hot')}
                >
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  热门
                </Button>
                <Button
                  variant={sortMode === 'new' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 rounded-full px-3 text-xs"
                  onClick={() => setSortMode('new')}
                >
                  最新
                </Button>
              </div>
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(true)}
                  className="h-8 text-xs text-muted-foreground"
                >
                  <History className="mr-1 h-4 w-4" />
                  我的
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-0 p-0">
          {user ? (
            <div id="comment-input" className="border-b bg-muted/20 p-4 sm:p-5">
              <div className="flex gap-3">
                <Avatar className="h-9 w-9 border bg-muted">
                  <AvatarImage src={user.avatar || undefined} alt={user.nickname} />
                  <AvatarFallback className="text-xs font-medium">
                    {getInitial(user.nickname)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  {replyingTo && (
                    <div className="mb-2 flex min-w-0 items-center justify-between rounded-md border bg-card px-3 py-2 text-xs">
                      <span className="min-w-0 truncate text-muted-foreground">
                        回复 <span className="text-foreground">@{replyingTo.user.nickname}</span>
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={cancelReply}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                  <Textarea
                    ref={inputRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                        handleSubmit();
                      }
                    }}
                    placeholder={
                      replyingTo
                        ? `回复 @${replyingTo.user.nickname}，友善交流一下`
                        : '留下你的看法，和大家聊聊'
                    }
                    className="min-h-20 resize-none rounded-lg bg-card text-sm leading-6"
                    maxLength={MAX_COMMENT_LENGTH}
                  />
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <SmilePlus className="h-4 w-4" />
                      <span className={cn(remaining < 20 && 'text-destructive')}>
                        {content.length}/{MAX_COMMENT_LENGTH}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {replyingTo && (
                        <Button variant="ghost" size="sm" onClick={cancelReply}>
                          取消
                        </Button>
                      )}
                      <Button
                        onClick={handleSubmit}
                        disabled={submitting || !content.trim()}
                        size="sm"
                        className="rounded-full px-4"
                      >
                        {submitting ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="mr-1 h-4 w-4" />
                        )}
                        {replyingTo ? '回复' : '发布'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-b bg-muted/20 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">登录后参与评论</p>
                    <p className="truncate text-xs text-muted-foreground">
                      回复、点赞和查看自己的评论记录
                    </p>
                  </div>
                </div>
                <Link href="/login">
                  <Button size="sm" className="shrink-0 rounded-full">
                    去登录
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              加载评论中
            </div>
          ) : sortedComments.length > 0 ? (
            <div>
              {sortedComments.map((comment) => {
                const replies = comment.replies || [];
                const isExpanded = expandedReplies.has(comment.id);
                const visibleReplies = isExpanded
                  ? replies
                  : replies.slice(0, INITIAL_REPLY_COUNT);
                const hiddenReplyCount = replies.length - visibleReplies.length;

                return (
                  <div key={comment.id} className="border-b px-4 py-5 last:border-b-0 sm:px-5">
                    <CommentItem
                      comment={comment}
                      onReply={handleReply}
                      onLike={toggleLike}
                      liked={likedIds.has(comment.id)}
                      likeCount={likedIds.has(comment.id) ? 1 : 0}
                    />

                    {replies.length > 0 && (
                      <div className="mt-3 space-y-3 pl-12">
                        <div className="space-y-4 rounded-lg bg-muted/35 p-3">
                          {visibleReplies.map((reply) => (
                            <CommentItem
                              key={reply.id}
                              comment={reply}
                              onReply={handleReply}
                              onLike={toggleLike}
                              liked={likedIds.has(reply.id)}
                              likeCount={likedIds.has(reply.id) ? 1 : 0}
                              isReply
                            />
                          ))}
                        </div>
                        {replies.length > INITIAL_REPLY_COUNT && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 rounded-full px-2 text-xs text-muted-foreground"
                            onClick={() => toggleReplies(comment.id)}
                          >
                            {isExpanded
                              ? '收起回复'
                              : `展开 ${hiddenReplyCount} 条回复`}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 px-4 py-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="min-w-16 text-center text-sm text-muted-foreground">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-14 text-center text-muted-foreground">
              <MessageCircle className="mx-auto mb-2 h-9 w-9 opacity-50" />
              <p className="text-sm">暂无评论，来坐第一排</p>
            </div>
          )}
        </CardContent>
      </Card>

      <HistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </>
  );
}
