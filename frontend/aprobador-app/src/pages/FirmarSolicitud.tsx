// import { useState, } from 'react';
// import { firmarSolicitud } from '../services/api';

// const FirmarSolicitud = () => {
//   const [mensaje, setMensaje] = useState('');
//   const [fechaFirma, setFechaFirma] = useState('');

//   const solicitud = JSON.parse(sessionStorage.getItem('solicitud') || '{}');
//   const aprobador = JSON.parse(sessionStorage.getItem('aprobador') || '{}');
//   const solicitudId = sessionStorage.getItem('solicitud_id');
//   const token = sessionStorage.getItem('token');

//   const manejarAccion = async (accion: 'aprobar' | 'rechazar') => {
//     try {
//       const res = await firmarSolicitud(solicitudId!, token!, accion);
//       setMensaje(res.message || 'Acción registrada');
//       setFechaFirma(res.fechaFirma || '');
//     } catch (err) {
//       console.error(err);
//       setMensaje('Error al registrar la acción');
//     }
//   };

//   if (!solicitudId || !token) return <p>❌ Datos faltantes. Regrese a validar token.</p>;

//   return (
//     <div style={{ padding: 40 }}>
//       {mensaje && (
//         <div style={{
//           backgroundColor: mensaje.includes('Rechazado') ? '#ffe0e0' : '#e0ffe0',
//           padding: '15px',
//           marginBottom: '20px'
//         }}>
//           <p>{mensaje}</p>
//           {fechaFirma && <p><strong>Fecha de firma:</strong> {new Date(fechaFirma).toLocaleString()}</p>}
//         </div>
//       )}
//       <h2>📝 Solicitud: {solicitud.titulo}</h2>
//       <p><strong>Descripción:</strong> {solicitud.descripcion}</p>
//       <p><strong>Solicitante:</strong> {solicitud.solicitante}</p>
//       <hr />
//       <p><strong>Usted:</strong> {aprobador.nombre}</p>
//       <p><strong>Estado actual:</strong> {aprobador.estado}</p>

//       <button onClick={() => manejarAccion('aprobar')}>✅ Aprobar</button>
//       <button onClick={() => manejarAccion('rechazar')}>❌ Rechazar</button>
//     </div>
//   );
// };

// export default FirmarSolicitud;

import { useState } from 'react';
import { firmarSolicitud } from '../services/api';

const FirmarSolicitud = () => {
  const [mensaje, setMensaje] = useState('');
  const [fechaFirma, setFechaFirma] = useState('');

  const solicitud = JSON.parse(sessionStorage.getItem('solicitud') || '{}');
  const aprobador = JSON.parse(sessionStorage.getItem('aprobador') || '{}');
  const solicitudId = sessionStorage.getItem('solicitud_id');
  const token = sessionStorage.getItem('token');

  const manejarAccion = async (accion: 'aprobar' | 'rechazar') => {
    try {
      const res = await firmarSolicitud(solicitudId!, token!, accion);
      setMensaje(res.message || 'Acción registrada');
      setFechaFirma(res.fechaFirma || '');
    } catch (err) {
      console.error(err);
      setMensaje('Error al registrar la acción');
    }
  };

  if (!solicitudId || !token) return <p>❌ Datos faltantes. Regrese a validar token.</p>;

  return (
    <div style={{ padding: 40 }}>
      {mensaje && (
        <div style={{
          backgroundColor: mensaje.includes('Rechazado') ? '#ffe0e0' : '#e0ffe0',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <p>{mensaje}</p>
          {fechaFirma && <p><strong>Fecha de firma:</strong> {new Date(fechaFirma).toLocaleString()}</p>}
        </div>
      )}
      <h2>📝 Solicitud: {solicitud.titulo}</h2>
      <p><strong>Descripción:</strong> {solicitud.descripcion}</p>
      <p><strong>Solicitante:</strong> {solicitud.solicitante}</p>
      <hr />
      <p><strong>Usted:</strong> {aprobador.nombre}</p>
      <p><strong>Estado actual:</strong> {aprobador.estado}</p>

      <button
        onClick={() => manejarAccion('aprobar')}
        style={{
          backgroundColor: 'green',
          color: 'white',
          padding: '10px 20px',
          marginRight: 10,
          marginTop: 20
        }}
      >
        ✅ Aprobar
      </button>
      <button
        onClick={() => manejarAccion('rechazar')}
        style={{
          backgroundColor: 'red',
          color: 'white',
          padding: '10px 20px',
          marginTop: 20
        }}
      >
        ❌ Rechazar
      </button>
    </div>
  );
};

export default FirmarSolicitud;
