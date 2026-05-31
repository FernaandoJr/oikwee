import { describe, expect, it } from 'vitest';
import { PayloadBuilder } from './PayloadBuilder';

describe('PayloadBuilder', () => {
  describe('from()', () => {
    it('retorna os campos válidos', () => {
      const result = PayloadBuilder().from({ name: 'Netflix', amount: 49.9 });
      expect(result).toEqual({ name: 'Netflix', amount: 49.9 });
    });

    it('remove o id automaticamente', () => {
      const result = PayloadBuilder().from({ id: '123', name: 'Netflix' });
      expect(result).not.toHaveProperty('id');
    });

    it('remove campos undefined', () => {
      const result = PayloadBuilder().from({ name: 'Netflix', notes: undefined });
      expect(result).not.toHaveProperty('notes');
    });

    it('remove campos null', () => {
      const result = PayloadBuilder().from({ name: 'Netflix', notes: null as unknown as string });
      expect(result).not.toHaveProperty('notes');
    });

    it('remove strings vazias', () => {
      const result = PayloadBuilder().from({ name: 'Netflix', notes: '' });
      expect(result).not.toHaveProperty('notes');
    });

    it('remove strings com só espaços', () => {
      const result = PayloadBuilder().from({ name: 'Netflix', notes: '   ' });
      expect(result).not.toHaveProperty('notes');
    });

    it('remove NaN', () => {
      const result = PayloadBuilder().from({ name: 'Netflix', amount: NaN });
      expect(result).not.toHaveProperty('amount');
    });

    it('remove arrays vazios', () => {
      const result = PayloadBuilder().from({ name: 'Netflix', tags: [] as string[] });
      expect(result).not.toHaveProperty('tags');
    });

    it('remove objetos vazios', () => {
      const result = PayloadBuilder().from({ name: 'Netflix', meta: {} as Record<string, string> });
      expect(result).not.toHaveProperty('meta');
    });

    it('faz trim em strings', () => {
      const result = PayloadBuilder().from({ name: '  Netflix  ', notes: ' mensal ' });
      expect(result).toEqual({ name: 'Netflix', notes: 'mensal' });
    });

    it('limpa recursivamente objetos aninhados', () => {
      const result = PayloadBuilder().from({
        name: 'Netflix',
        meta: { label: '  ok  ', empty: '' } as Record<string, string>,
      });
      expect(result).toEqual({ name: 'Netflix', meta: { label: 'ok' } });
    });

    it('preserva false e 0 como valores válidos', () => {
      const result = PayloadBuilder().from({ isPaid: false, amount: 0 });
      expect(result).toEqual({ isPaid: false, amount: 0 });
    });

    it('preserva arrays com itens', () => {
      const result = PayloadBuilder().from({ name: 'x', tags: ['a', 'b'] as string[] });
      expect(result).toEqual({ name: 'x', tags: ['a', 'b'] });
    });
  });

  describe('ignoreKeys()', () => {
    it('remove as chaves informadas', () => {
      const result = PayloadBuilder({ ignoreKeys: ['createdAt', 'updatedAt'] }).from({
        name: 'Netflix',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
      } as Record<string, string>);
      expect(result).not.toHaveProperty('createdAt');
      expect(result).not.toHaveProperty('updatedAt');
      expect(result).toHaveProperty('name');
    });
  });
});
