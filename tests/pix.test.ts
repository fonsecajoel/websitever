import { describe, expect, it } from 'vitest';
import { buildPixPayload, crc16 } from '../src/lib/pix';

describe('pix', () => {
  it('crc16 CCITT-FALSE conhecido', () => expect(crc16('123456789')).toBe('29B1'));
  it('payload válido com valor e CRC', () => {
    const p = buildPixPayload({ key: '56159388000122', amount: 513, merchantName: 'Santo Salto', merchantCity: 'Jundiaí', txid: 'SS-1001', description: 'Encomenda' });
    expect(p.startsWith('000201')).toBe(true);
    expect(p).toContain('5406513.00');
    expect(p).toContain('JUNDIAI');
    expect(p).toContain('SS1001');
    expect(crc16(p.slice(0, -4))).toBe(p.slice(-4));
  });
  it('txid vazio vira ***', () => expect(buildPixPayload({ key: 'k', amount: 1, merchantName: 'a', merchantCity: 'b', txid: '--' })).toContain('0503***'));
});
