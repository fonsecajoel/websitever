import type { AstroCookies } from 'astro';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '../env';
import { supabaseForRequest } from './supabase';

export interface SessionInfo { user: User | null; isAdmin: boolean }

export async function getSession(request: Request, cookies: AstroCookies): Promise<SessionInfo> {
  if (!isSupabaseConfigured()) return { user: null, isAdmin: false };
  const sb = supabaseForRequest(request, cookies);
  const { data } = await sb.auth.getUser();
  if (!data.user) return { user: null, isAdmin: false };
  const { data: profile } = await sb.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
  return { user: data.user, isAdmin: profile?.role === 'admin' };
}

/** Permite entrar com nome de utilizador (ex.: "admin") além de e-mail. */
export const loginIdentifierToEmail = (value: string): string => {
  const v = value.trim().toLowerCase();
  return v.includes('@') ? v : `${v}@santosalto.admin`;
};
