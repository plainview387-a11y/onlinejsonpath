import jwt from 'jsonwebtoken';
import { getJwtSecret } from '@/lib/env';

/**
 * 验证验证码
 * @param token 验证码token
 * @param code 用户输入的验证码
 * @returns 是否验证成功
 */
export function verifyCaptcha(token: string, code: string): { valid: boolean; error?: string } {
  if (!token || !code) {
    return { valid: false, error: '请输入验证码' };
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { code: string; timestamp: number };
    
    // 比对验证码（忽略大小写）
    if (decoded.code === code.toLowerCase().trim()) {
      return { valid: true };
    }
    
    return { valid: false, error: '验证码错误' };
  } catch {
    return { valid: false, error: '验证码已过期，请重新获取' };
  }
}
