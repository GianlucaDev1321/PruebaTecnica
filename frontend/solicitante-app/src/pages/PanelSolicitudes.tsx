// src/pages/PanelSolicitudes.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const PanelSolicitudes: React.FC = () => {
  return (
    <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: 800, width: '100%', background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Panel de Solicitudes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Link to="crear" style={buttonLink}>+ Crear nueva solicitud</Link>
          <Link to="lista" style={buttonLink}>📋 Ver solicitudes existentes</Link>
        </div>
      </div>
    </div>
  );
};

const buttonLink: React.CSSProperties = {
  backgroundColor: '#007bff',
  color: '#fff',
  padding: '12px 20px',
  textDecoration: 'none',
  borderRadius: 8,
  fontWeight: 'bold',
  textAlign: 'center'
};

export default PanelSolicitudes;
