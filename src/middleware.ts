import { defineMiddleware } from 'astro:middleware';
import { getSession } from './lib/server/auth';

const PUBLIC_ADMIN = new Set(['/admin/login', '/admin/login/']);

export const onRequest = defineMiddleware(async (ctx, next) => {
  const { pathname } = ctx.url;
  const needsAdmin = (pathname.startsWith('/admin') && !PUBLIC_ADMIN.has(pathname)) || pathname.startsWith('/api/admin');
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin') || pathname.startsWith('/conta')) {
    const session = await getSession(ctx.request, ctx.cookies);
    ctx.locals.user = session.user;
    ctx.locals.isAdmin = session.isAdmin;
    if (needsAdmin && !session.isAdmin) {
      if (pathname.startsWith('/api/')) return new Response(JSON.stringify({ error: 'Não autorizado' }), { status: 401 });
      return ctx.redirect(`/admin/login?next=${encodeURIComponent(pathname)}`);
    }
  }
  return next();
});
