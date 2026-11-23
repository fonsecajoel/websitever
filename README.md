# Santo Salto Store — v2

Loja online + painel de gestão. **Astro 6 (SSR, Vercel) · Tailwind 4 · Supabase · Stripe · Pix**.

## Arrancar

```bash
pnpm install
cp .env.example .env   # preencher as chaves
pnpm dev               # http://localhost:4321
```

Sem `.env` o site funciona com o catálogo de demonstração (checkout e admin ficam desativados).

## Supabase (uma vez)

1. **SQL Editor** → colar e correr `supabase/migrations/0001_init.sql` (tabelas, RLS, bucket `products`).
2. Correr `supabase/seed.sql` (categorias, coleções, 18 produtos, cupão `BEMVINDA10`).
3. **Authentication → Users → Add user** com o e-mail da gestão; depois no SQL Editor:
   ```sql
   update public.profiles set role = 'admin' where email = 'EMAIL_DA_GESTAO';
   ```
4. Copiar `Project URL`, `anon key` e `service_role key` (Settings → API) para o `.env`.

## Stripe

1. `STRIPE_SECRET_KEY` (Developers → API keys).
2. Webhook → endpoint `https://O-SEU-DOMINIO/api/stripe/webhook` com os eventos
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
   `checkout.session.async_payment_failed`, `checkout.session.expired` → copiar o `whsec_…` para `STRIPE_WEBHOOK_SECRET`.
3. Local: `stripe listen --forward-to localhost:4321/api/stripe/webhook`.

## Pagamentos

- **Pix**: gera QR Code + “Copia e Cola” com o valor exato e o nº da encomenda (BR Code EMV). A gestão confirma o pagamento no admin (*Encomendas → Confirmar Pix recebido*).
- **Stripe**: Stripe Checkout (cartão, Apple/Google Pay); o webhook marca a encomenda como paga ou cancela e repõe stock se expirar.
- Os preços são **sempre recalculados no servidor**; o stock é reservado ao criar a encomenda.

## Estrutura

| Pasta | O quê |
|---|---|
| `src/pages` | Loja (home, coleções, produto, provador, checkout, conta, pedido) |
| `src/pages/admin` | Painel: dashboard, produtos, encomendas, clientes, cupões, mensagens, newsletter, coleções, definições |
| `src/pages/api` | checkout, webhook Stripe, cupões, newsletter, contacto, pesquisa, upload admin |
| `src/lib` | tipos, preços, Pix, clientes Supabase/Stripe, catálogo |
| `supabase/` | migração e seed |
| `tests/` | Vitest (`pnpm test:coverage`, mínimo 80%) |

## Scripts

`pnpm dev` · `pnpm build` · `pnpm check` · `pnpm test` · `pnpm validate` · `pnpm db:seed-sql`
