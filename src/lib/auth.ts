const ADMIN_EMAIL = import.meta.env.ADMIN_EMAIL || 'admin@santo-salto.com';
const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD || 'admin123';
const SESSION_SECRET = import.meta.env.SESSION_SECRET || 'dev-secret-change-me';

export function validateCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function createSessionToken(): string {
  const payload = `${Date.now()}-${SESSION_SECRET}`;
  return btoa(payload);
}

export function validateSession(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = atob(token);
    return decoded.endsWith(`-${SESSION_SECRET}`);
  } catch {
    return false;
  }
}

export function getSessionFromCookies(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  return match?.[1];
}
