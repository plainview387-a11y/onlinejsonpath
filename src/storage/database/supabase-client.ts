import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

let envLoaded = false;

interface SupabaseCredentials {
  url: string;
  anonKey: string;
}

const SUPABASE_URL_KEYS = [
  'COZE_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_URL',
] as const;

const SUPABASE_ANON_KEY_KEYS = [
  'COZE_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_ANON_KEY',
] as const;

function getFirstEnvValue(keys: readonly string[]): string | undefined {
  return keys.map((key) => process.env[key]).find(Boolean);
}

function hasSupabaseCredentials(): boolean {
  return Boolean(
    getFirstEnvValue(SUPABASE_URL_KEYS) &&
    getFirstEnvValue(SUPABASE_ANON_KEY_KEYS)
  );
}

function loadEnv(): void {
  if (envLoaded || hasSupabaseCredentials()) {
    return;
  }

  try {
    dotenv.config();
    if (hasSupabaseCredentials()) {
      envLoaded = true;
      return;
    }

    const pythonCode = `
import os
import sys
try:
    from coze_workload_identity import Client
    client = Client()
    env_vars = client.get_project_env_vars()
    client.close()
    for env_var in env_vars:
        print(f"{env_var.key}={env_var.value}")
except Exception as e:
    print(f"# Error: {e}", file=sys.stderr)
`;

    const output = execSync(`python3 -c '${pythonCode.replace(/'/g, "'\"'\"'")}'`, {
      encoding: 'utf-8',
      timeout: 10000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const lines = output.trim().split('\n');
    for (const line of lines) {
      if (line.startsWith('#')) continue;
      const eqIndex = line.indexOf('=');
      if (eqIndex > 0) {
        const key = line.substring(0, eqIndex);
        let value = line.substring(eqIndex + 1);
        if ((value.startsWith("'") && value.endsWith("'")) ||
            (value.startsWith('"') && value.endsWith('"'))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }

    envLoaded = true;
  } catch {
    // Silently fail
  }
}

function getSupabaseCredentials(): SupabaseCredentials {
  loadEnv();

  const url = getFirstEnvValue(SUPABASE_URL_KEYS);
  const anonKey = getFirstEnvValue(SUPABASE_ANON_KEY_KEYS);

  if (!url) {
    throw new Error(`Supabase URL is not set. Expected one of: ${SUPABASE_URL_KEYS.join(', ')}`);
  }
  if (!anonKey) {
    throw new Error(`Supabase anon key is not set. Expected one of: ${SUPABASE_ANON_KEY_KEYS.join(', ')}`);
  }

  return { url, anonKey };
}

function getSupabaseClient(token?: string): SupabaseClient {
  const { url, anonKey } = getSupabaseCredentials();

  if (token) {
    return createClient(url, anonKey, {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
      db: {
        timeout: 60000,
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return createClient(url, anonKey, {
    db: {
      timeout: 60000,
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export { loadEnv, getSupabaseCredentials, getSupabaseClient };
