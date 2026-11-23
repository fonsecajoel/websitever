import type { AstroCookies } from 'astro';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '../env';
import { supabaseForRequest } from './supabase';

/** Única conta com acesso à gestão. Qualquer outra conta é sempre cliente. */
export const ADMIN_EMAIL = 'admin@santosalto.admin';
const ADMIN_DOMAIN = '@santosalto.admin';

export const isAdminAccount = (email: string | null | undefined, role: string | null | undefined): boolean =>
  role === 'admin' && (email ?? '').toLowerCase() === ADMIN_EMAIL;

/** E-mails reservados (não podem ser usados para criar contas de cliente). */
export const isReservedEmail = (email: string): boolean => email.trim().toLowerCase().endsWith(ADMIN_DOMAIN);

export interface SessionInfo { user: User | null; isAdmin: boolean }

export async function getSession(request: Request, cookies: AstroCookies): Promise<SessionInfo> {
  if (!isSupabaseConfigured()) return { user: null, isAdmin: false };
  const sb = supabaseForRequest(request, cookies);
  const { data } = await sb.auth.getUser();
  if (!data.user) return { user: null, isAdmin: false };
  const { data: profile } = await sb.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
  return { user: data.user, isAdmin: isAdminAccount(data.user.email, profile?.role) };
}

/** Permite entrar com nome de utilizador (ex.: "admin") além de e-mail. */
export const loginIdentifierToEmail = (value: string): string => {
  const v = value.trim().toLowerCase();
  return v.includes('@') ? v : `${v}${ADMIN_DOMAIN}`;
};
