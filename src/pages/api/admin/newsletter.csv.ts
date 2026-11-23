import type { APIRoute } from 'astro';
import { supabaseForRequest } from '../../../lib/server/supabase';

const cell = (v: string): string => `"${v.replace(/"/g, '""')}"`;

export const GET: APIRoute = async ({ request, cookies }) => {
  const { data, error } = await supabaseForRequest(request, cookies)
    .from('newsletter_subscribers').select('email,source,created_at').order('created_at', { ascending: false });
  if (error) return new Response(error.message, { status: 500 });
  const rows = (data ?? []) as { email: string; source: string; created_at: string }[];
  const csv = ['email,origem,data', ...rows.map((r) => [cell(r.email), cell(r.source), cell(r.created_at)].join(','))].join('\n');
  return new Response(`﻿${csv}`, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="newsletter-santo-salto-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
};
