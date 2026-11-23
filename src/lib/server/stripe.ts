import Stripe from 'stripe';
import { env } from '../env';

let client: Stripe | null = null;
export function stripe(): Stripe {
  if (!env.stripeSecretKey) throw new Error('STRIPE_SECRET_KEY em falta.');
  client ??= new Stripe(env.stripeSecretKey);
  return client;
}
