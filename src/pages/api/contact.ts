import type { APIRoute } from 'astro';
import { z } from 'astro/zod';
import { isSupabaseConfigured } from '../../lib/env';
import { json, readJson } from '../../lib/server/http';
import { supabaseService } from '../../lib/server/supabase';

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().trim().toLowerCase().max(160),
  phone: z.string().trim().max(30).default(''),
  subject: z.string().trim().max(160).default(''),
  message: z.string().trim().min(5).max(4000),
  website: z.string().max(0).optional(), // honeypot
});

export const POST: APIRoute = async ({ request }) => {
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return json({ error: 'Verifique os campos do formulário.' }, 400);
  if (!isSupabaseConfigured()) return json({ error: 'Formulário indisponível — use o WhatsApp.' }, 503);
  const { website: _hp, ...data } = parsed.data;
  const { error } = await supabaseService().from('contact_messages').insert(data);
  if (error) return json({ error: 'Não foi possível enviar.' }, 500);
  return json({ ok: true });
};
