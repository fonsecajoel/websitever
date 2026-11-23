import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';
import { env } from '../env';

/** Cliente com a sessão do utilizador (respeita RLS). */
export function supabaseForRequest(request: Request, cookies: AstroCookies): SupabaseClient {
  if (!env.supabaseUrl || !env.supabaseAnonKey) throw new Error('Supabase não configurado (PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY).');
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('cookie') ?? '').map((c) => ({ name: c.name, value: c.value ?? '' }));
      },
      setAll(list) {
        for (const { name, value, options } of list) cookies.set(name, value, { ...options, path: '/' });
      },
    },
  });
}

/** Cliente anónimo sem sessão (leituras públicas do catálogo). */
let anonClient: SupabaseClient | null = null;
export function supabasePublic(): SupabaseClient {
  if (!env.supabaseUrl || !env.supabaseAnonKey) throw new Error('Supabase não configurado.');
  anonClient ??= createClient(env.supabaseUrl, env.supabaseAnonKey, { auth: { persistSession: false } });
  return anonClient;
}

/** Service role — APENAS no servidor (encomendas, webhooks, newsletter). Ignora RLS. */
let adminClient: SupabaseClient | null = null;
export function supabaseService(): SupabaseClient {
  if (!env.supabaseUrl || !env.supabaseServiceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY em falta.');
  adminClient ??= createClient(env.supabaseUrl, env.supabaseServiceKey, { auth: { persistSession: false } });
  return adminClient;
}
