function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`${name} is required`);
  }
  return value;
}

export function getJwtSecret(): string {
  return requireEnv('JWT_SECRET');
}
