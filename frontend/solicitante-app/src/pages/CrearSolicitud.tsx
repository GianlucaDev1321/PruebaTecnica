

import React, { useState } from 'react';
import { crearSolicitud } from '../services/api';

const CrearSolicitud: React.FC = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [solicitante, setSolicitante] = useState('');
  const [aprobadores, setAprobadores] = useState([
    { nombre: '', correo: '' },
    { nombre: '', correo: '' },
    { nombre: '', correo: '' }
  ]);
  const [respuesta, setRespuesta] = useState<any>(null);

  const handleAprobadorChange = (index: number, field: 'nombre' | 'correo', value: string) => {
    const nuevos = [...aprobadores];
    nuevos[index][field] = value;
    setAprobadores(nuevos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      titulo,
      descripcion,
      monto: parseFloat(monto),
      solicitante,
      aprobadores
    };

    try {
      const response = await crearSolicitud(payload);
      setRespuesta(response);
    } catch (error) {
      alert('Error al crear la solicitud');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 600, width: '100%', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Crear Solicitud de Compra</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required style={inputStyle} />
          
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            style={{ ...inputStyle, height: 80, resize: 'none', width: '100%' }}
          />
          
          <input type="number" placeholder="Monto" value={monto} onChange={(e) => setMonto(e.target.value)} required style={inputStyle} />
          <input type="email" placeholder="Correo del solicitante" value={solicitante} onChange={(e) => setSolicitante(e.target.value)} required style={inputStyle} />

          <div>
            <h4 style={{ marginBottom: 8 }}>Aprobadores:</h4>
            {aprobadores.map((ap, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input type="text" placeholder={`Nombre ${i + 1}`} value={ap.nombre} onChange={(e) => handleAprobadorChange(i, 'nombre', e.target.value)} required style={{ ...inputStyle, flex: 1 }} />
                <input type="email" placeholder={`Correo ${i + 1}`} value={ap.correo} onChange={(e) => handleAprobadorChange(i, 'correo', e.target.value)} required style={{ ...inputStyle, flex: 1 }} />
              </div>
            ))}
          </div>

          <button type="submit" style={buttonStyle}>Enviar Solicitud</button>
        </form>

        {respuesta && (
          <div style={{
            marginTop: 32,
            backgroundColor: '#e9f5ff',
            padding: 24,
            borderRadius: 10,
            border: '1px solid #b3d9ff'
          }}>
            <h3 style={{ color: '#007bff', marginBottom: 8 }}>
              ✅ {respuesta.mensaje}
            </h3>
            <p style={{ marginBottom: 16 }}>
              <strong>ID Solicitud:</strong> {respuesta.solicitudId}
            </p>
            <p><strong>Enlaces para aprobar:</strong></p>
            <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
              {respuesta.links.map((link: string, i: number) => (
                <li key={i}>
                  <a href={link} target="_blank" rel="noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>
                    Aprobador {i + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  border: '1px solid #ccc',
  borderRadius: 8,
  fontSize: 14,
  width: '100%',
  boxSizing: 'border-box',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#007bff',
  color: '#fff',
  padding: '12px 16px',
  border: 'none',
  borderRadius: 8,
  fontWeight: 'bold',
  fontSize: 16,
  cursor: 'pointer',
  transition: 'background-color 0.3s ease'
};

export default CrearSolicitud;
