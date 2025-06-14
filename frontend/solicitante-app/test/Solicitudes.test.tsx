// test/ListaSolicitudes.test.tsx
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ListaSolicitudes from '../src/pages/ListaSolicitudes';
import * as api from '../src/services/api';
import * as utils from '../src/utils/normalizarDynamoItem';

// ✅ Los mocks deben ir antes de todo uso
vi.mock('../src/services/api', async () => {
  const mockSolicitudes = [
    { id: '1', titulo: 'Solicitud A', descripcion: 'Desc A', estado: 'Pendiente' },
    { id: '2', titulo: 'Solicitud B', descripcion: 'Desc B', estado: 'Completada' },
  ];

  return {
    obtenerSolicitudes: vi.fn().mockResolvedValue(mockSolicitudes),
    descargarEvidencia: vi.fn(),
  };
});

vi.mock('../src/utils/normalizarDynamoItem', async () => {
  return {
    normalizarDynamoItem: vi.fn((item) => item), // No modifica
  };
});

describe('ListaSolicitudes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza la tabla con las solicitudes y muestra botón de descarga si está completada', async () => {
    render(<ListaSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText('📄 Solicitudes')).toBeInTheDocument();
      expect(screen.getByText('Solicitud A')).toBeInTheDocument();
      expect(screen.getByText('Solicitud B')).toBeInTheDocument();
    });

    expect(screen.queryAllByText('📥 Descargar PDF')).toHaveLength(1);
    expect(screen.getByText('📥 Descargar PDF')).toBeInTheDocument();
  });

  it('llama a descargarEvidencia al hacer click en el botón de descarga', async () => {
    render(<ListaSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText('📥 Descargar PDF')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('📥 Descargar PDF'));

    expect(api.descargarEvidencia).toHaveBeenCalledWith('2');
  });

  it('muestra mensaje de error si la API falla', async () => {
    (api.obtenerSolicitudes as Mock).mockRejectedValue(new Error('Error'));

    render(<ListaSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText('No se pudieron cargar las solicitudes')).toBeInTheDocument();
    });
  });
});
