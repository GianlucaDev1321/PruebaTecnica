// test/normalizarDynamoItem.test.ts
import { describe, it, expect } from 'vitest';
import { normalizarDynamoItem } from '../src/utils/normalizarDynamoItem';

describe('normalizarDynamoItem', () => {
  it('convierte correctamente atributos tipo S, N y BOOL', () => {
    const item = {
      id: { S: 'abc123' },
      cantidad: { N: '42' },
      activo: { BOOL: true },
    };

    const resultado = normalizarDynamoItem(item);

    expect(resultado).toEqual({
      id: 'abc123',
      cantidad: 42,
      activo: true,
    });
  });

  it('deja valores primitivos sin cambios', () => {
    const item = {
      mensaje: 'texto directo',
      valor: 123,
      valido: false,
    };

    const resultado = normalizarDynamoItem(item);

    expect(resultado).toEqual({
      mensaje: 'texto directo',
      valor: 123,
      valido: false,
    });
  });

  it('ignora estructuras no reconocidas y las deja igual', () => {
    const item = {
      desconocido: { X: '??' },
    };

    const resultado = normalizarDynamoItem(item);

    expect(resultado).toEqual({
      desconocido: { X: '??' },
    });
  });

  it('maneja valores null o undefined sin fallar', () => {
    const item = {
      nulo: null,
      indefinido: undefined,
    };

    const resultado = normalizarDynamoItem(item);

    expect(resultado).toEqual({
      nulo: null,
      indefinido: undefined,
    });
  });
});
