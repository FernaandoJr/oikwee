import { describe, expect, it } from 'vitest';
import { PatchDiff } from './PatchDiff';

describe('PatchDiff', () => {
  describe('diff()', () => {
    it('retorna apenas os campos alterados', () => {
      const result = new PatchDiff().diff(
        { name: 'Disney+', amount: 29.9 },
        { name: 'Netflix', amount: 29.9 },
      );
      expect(result).toEqual({ name: 'Disney+' });
    });

    it('retorna objeto vazio quando nada mudou', () => {
      const result = new PatchDiff().diff(
        { name: 'Netflix', amount: 49.9 },
        { name: 'Netflix', amount: 49.9 },
      );
      expect(result).toEqual({});
    });

    it('inclui campo com novo valor quando antes estava ausente', () => {
      type T = { name: string; notes?: string };
      const result = new PatchDiff().diff<T>(
        { name: 'Netflix', notes: 'mensal' },
        { name: 'Netflix' },
      );
      expect(result).toEqual({ notes: 'mensal' });
    });

    it('nullifica campo que existia e foi removido do next (ausente)', () => {
      type T = { name: string; notes?: string };
      const result = new PatchDiff().diff<T>(
        { name: 'Netflix' },
        { name: 'Netflix', notes: 'mensal' },
      );
      expect(result).toEqual({ notes: null });
    });

    it('nullifica campo definido como undefined explicitamente', () => {
      type T = { name: string; notes?: string };
      const result = new PatchDiff().diff<T>(
        { name: 'Netflix', notes: undefined },
        { name: 'Netflix', notes: 'mensal' },
      );
      expect(result).toEqual({ notes: null });
    });

    it('nullifica campo definido como null explicitamente', () => {
      const result = new PatchDiff().diff(
        { name: 'Netflix', notes: null as unknown as string },
        { name: 'Netflix', notes: 'mensal' },
      );
      expect(result).toEqual({ notes: null });
    });

    it('nullifica array esvaziado', () => {
      const result = new PatchDiff().diff(
        { name: 'Netflix', tags: [] as string[] },
        { name: 'Netflix', tags: ['drama'] },
      );
      expect(result).toEqual({ tags: null });
    });

    it('inclui novo array quando mudou', () => {
      const result = new PatchDiff().diff(
        { name: 'Netflix', tags: ['drama', 'action'] as string[] },
        { name: 'Netflix', tags: ['drama'] },
      );
      expect(result).toEqual({ tags: ['drama', 'action'] });
    });

    it('faz diff de objeto aninhado', () => {
      const result = new PatchDiff().diff(
        { name: 'Netflix', meta: { label: 'novo' } as Record<string, string> },
        { name: 'Netflix', meta: { label: 'antigo' } as Record<string, string> },
      );
      expect(result).toEqual({ meta: { label: 'novo' } });
    });

    it('não inclui objeto aninhado que não mudou', () => {
      const result = new PatchDiff().diff(
        { name: 'Netflix', meta: { label: 'igual' } as Record<string, string> },
        { name: 'Netflix', meta: { label: 'igual' } as Record<string, string> },
      );
      expect(result).toEqual({});
    });

    it('ignora chaves configuradas via ignoreKeys', () => {
      const result = new PatchDiff({ ignoreKeys: ['id', 'createdAt'] }).diff(
        { name: 'Disney+', createdAt: '2024-01-01' } as Record<string, string>,
        { name: 'Netflix', createdAt: '2024-01-01' } as Record<string, string>,
      );
      expect(result).not.toHaveProperty('createdAt');
      expect(result).toEqual({ name: 'Disney+' });
    });

    it('não nullifica campo que já era vazio no prev', () => {
      type T = { name: string; notes?: string };
      const result = new PatchDiff().diff<T>(
        { name: 'Netflix' },
        { name: 'Netflix', notes: '' },
      );
      expect(result).not.toHaveProperty('notes');
    });

    it('preserva false e 0 como mudanças válidas', () => {
      const result = new PatchDiff().diff(
        { isPaid: false, amount: 0 },
        { isPaid: true, amount: 49.9 },
      );
      expect(result).toEqual({ isPaid: false, amount: 0 });
    });
  });
});
