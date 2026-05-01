import bcrypt from 'bcryptjs';
import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  nickname?: string;
  avatar?: string;
}

// 密码加密
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// 密码验证
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// 生成 JWT Token
export function generateToken(
  userId: string,
  email: string,
  nickname?: string,
  avatar?: string
): string {
  return jwt.sign(
    { userId, email, nickname, avatar },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// 验证 JWT Token
export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

function hashSeed(value: string): string {
  return createHash('sha256').update(value.toLowerCase()).digest('hex');
}

export function generateAvatarForSeed(seed: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}`;
}

export function generateLocalUser(email: string, nickname?: string) {
  const seed = hashSeed(email);
  const fallbackNickname = email.split('@')[0] || '临时用户';

  return {
    id: `local-${seed.slice(0, 24)}`,
    email,
    nickname: nickname?.trim() || fallbackNickname,
    avatar: generateAvatarForSeed(email),
    createdAt: new Date().toISOString(),
  };
}

// 生成随机头像 URL
export function generateRandomAvatar(): string {
  const styles = ['adventurer', 'avataaars', 'bottts', 'identicon', 'micah'];
  const style = styles[Math.floor(Math.random() * styles.length)];
  const seed = Math.random().toString(36).substring(7);
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
}
