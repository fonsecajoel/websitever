/** Variáveis de ambiente — PUBLIC_* podem ir para o browser, as restantes só no servidor. */
export const env = {
  supabaseUrl: import.meta.env.PUBLIC_SUPABASE_URL as string | undefined,
  supabaseAnonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined,
  supabaseServiceKey: import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined,
  stripeSecretKey: import.meta.env.STRIPE_SECRET_KEY as string | undefined,
  stripeWebhookSecret: import.meta.env.STRIPE_WEBHOOK_SECRET as string | undefined,
  siteUrl: (import.meta.env.PUBLIC_SITE_URL as string | undefined) ?? 'http://localhost:4321',
};

export const isSupabaseConfigured = (): boolean => Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const isStripeConfigured = (): boolean => Boolean(env.stripeSecretKey);
