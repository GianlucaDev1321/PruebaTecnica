import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PanelSolicitudes from '../src/pages/PanelSolicitudes';

describe('PanelSolicitudes', () => {
  it('renderiza correctamente los enlaces del panel', () => {
    render(
      <MemoryRouter>
        <PanelSolicitudes />
      </MemoryRouter>
    );

    expect(screen.getByText('Panel de Solicitudes')).toBeInTheDocument();

    const crearLink = screen.getByRole('link', { name: '+ Crear nueva solicitud' });
    expect(crearLink).toHaveAttribute('href', '/crear');

    const listaLink = screen.getByRole('link', { name: '📋 Ver solicitudes existentes' });
    expect(listaLink).toHaveAttribute('href', '/lista');
  });
});
