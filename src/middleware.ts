import { defineMiddleware } from 'astro:middleware';
import { validateSession, getSessionFromCookies } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = getSessionFromCookies(context.request.headers.get('cookie'));
    if (!validateSession(token)) {
      return context.redirect('/admin/login');
    }
  }

  return next();
});
