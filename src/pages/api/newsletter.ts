import type { APIRoute } from 'astro';
import { z } from 'astro/zod';
import { isSupabaseConfigured } from '../../lib/env';
import { json, readJson } from '../../lib/server/http';
import { supabaseService } from '../../lib/server/supabase';

const schema = z.object({ email: z.email().trim().toLowerCase().max(160), source: z.string().max(40).optional() });

export const POST: APIRoute = async ({ request }) => {
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return json({ error: 'E-mail inválido.' }, 400);
  if (!isSupabaseConfigured()) return json({ error: 'Subscrição indisponível de momento.' }, 503);
  const { error } = await supabaseService().from('newsletter_subscribers').upsert({ email: parsed.data.email, source: parsed.data.source ?? 'site' }, { onConflict: 'email', ignoreDuplicates: true });
  if (error) return json({ error: 'Não foi possível subscrever.' }, 500);
  return json({ ok: true });
};
