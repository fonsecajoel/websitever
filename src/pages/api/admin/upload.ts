import type { APIRoute } from 'astro';
import { supabaseForRequest } from '../../../lib/server/supabase';
import { slugify } from '../../../lib/server/admin/helpers';

const MAX = 8 * 1024 * 1024;
const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export const POST: APIRoute = async ({ request, cookies }) => {
  const fd = await request.formData();
  const file = fd.get('file');
  if (!(file instanceof File)) return json({ error: 'Ficheiro em falta.' }, 400);
  if (!file.type.startsWith('image/')) return json({ error: 'Só são aceites imagens.' }, 400);
  if (file.size > MAX) return json({ error: 'Imagem acima de 8 MB.' }, 400);

  const slugRaw = fd.get('slug');
  const folder = slugify(typeof slugRaw === 'string' ? slugRaw : '') || 'produto';
  const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const sb = supabaseForRequest(request, cookies);
  const { error } = await sb.storage.from('products').upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: false });
  if (error) return json({ error: error.message }, 500);
  const { data } = sb.storage.from('products').getPublicUrl(path);
  return json({ url: data.publicUrl });
};
