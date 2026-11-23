// Garante o papel admin da conta única de gestão: `node --env-file=.env scripts/make-admin.ts admin@santosalto.admin`
import { createClient } from '@supabase/supabase-js';

const email = process.argv[2]?.trim().toLowerCase();
if (!email) throw new Error('Uso: node --env-file=.env scripts/make-admin.ts admin@santosalto.admin');
if (email !== 'admin@santosalto.admin') throw new Error('Só a conta admin@santosalto.admin pode ser administradora.');
const db = createClient(process.env.PUBLIC_SUPABASE_URL ?? '', process.env.SUPABASE_SERVICE_ROLE_KEY ?? '', { auth: { persistSession: false } });

const { data, error } = await db.from('profiles').update({ role: 'admin' }).eq('email', email).select('email, role');
if (error) throw new Error(error.message);
if (!data?.length) throw new Error(`Nenhum utilizador com o e-mail ${email}. Crie-o primeiro em Authentication → Users.`);
console.log(`✓ ${email} é agora admin`);
