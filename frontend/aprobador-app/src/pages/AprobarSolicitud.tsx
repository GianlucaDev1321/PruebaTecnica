
// import React, { useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import axios from 'axios';

// const AprobarSolicitud: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const [tokenInput, setTokenInput] = useState('');
//   const [tokenValidado, setTokenValidado] = useState(false);
//   const [solicitud, setSolicitud] = useState<any>(null);
//   const [aprobador, setAprobador] = useState<any>(null);
//   const [error, setError] = useState('');
//   const [mensaje, setMensaje] = useState('');
//   const [fechaFirma, setFechaFirma] = useState('');
//   const [loading, setLoading] = useState(false);

//   const tokenFromURL = searchParams.get('approver_token');
//   const solicitudId = searchParams.get('solicitud_id');

//   useEffect(() => {
//     if (tokenFromURL) setTokenInput(tokenFromURL);
//   }, [tokenFromURL]);

//   const validarToken = async () => {
//     setError('');
//     setMensaje('');
//     setTokenValidado(false);
//     setSolicitud(null);
//     setAprobador(null);

//     if (!tokenInput) {
//       setError('Debe ingresar un token.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `https://wkot1znpzj.execute-api.us-east-2.amazonaws.com/dev/solicitudes/validar-acceso?token=${tokenInput}`
//       );

//       const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : JSON.parse(res.data.body);
//       if (!parsed || !parsed.solicitud || !parsed.aprobador) {
//         throw new Error('Token no válido');
//       }

//       setSolicitud(parsed.solicitud);
//       setAprobador(parsed.aprobador);
//       setTokenValidado(true);
//     } catch (err) {
//       console.error('❌ Error al validar token:', err);
//       setError('Token inválido o expirado.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const manejarAccion = async (accion: 'aprobar' | 'rechazar') => {
//     if (!tokenInput || !solicitudId) {
//       setMensaje('Faltan datos para procesar la acción');
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `https://wkot1znpzj.execute-api.us-east-2.amazonaws.com/dev/solicitudes/firma`,
//         {
//           solicitudId,
//           token: tokenInput,
//           accion
//         }
//       );

//       setMensaje(res.data.message || 'Acción registrada');
//       setFechaFirma(res.data.fechaFirma || '');
//     } catch (err) {
//       console.error('❌ Error al firmar:', err);
//       setMensaje('Error al registrar la acción');
//     }
//   };

//   return (
//     <div style={{ padding: 40 }}>
//       {/* VALIDACIÓN TOKEN */}
//       {!tokenValidado && (
//         <>
//           <h2>🔐 Validar acceso</h2>
//           <input
//             type="text"
//             value={tokenInput}
//             onChange={(e) => setTokenInput(e.target.value)}
//             placeholder="Ingrese el token"
//             style={{ width: '100%', padding: 10, marginBottom: 10 }}
//           />
//           <button
//             onClick={validarToken}
//             style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px' }}
//           >
//             Validar Token
//           </button>
//           {loading && <p>Validando...</p>}
//           {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
//         </>
//       )}

//       {/* FORMULARIO DE ACCIÓN */}
//       {tokenValidado && solicitud && aprobador && (
//         <>
//           {mensaje && (
//             <div
//               style={{
//                 backgroundColor: mensaje.includes('Rechazado') ? '#ffe0e0' : '#e0ffe0',
//                 padding: '15px',
//                 marginBottom: '20px'
//               }}
//             >
//               <p style={{ color: mensaje.includes('Rechazado') ? 'red' : 'green' }}>{mensaje}</p>
//               {fechaFirma && <p><strong>Fecha de firma:</strong> {new Date(fechaFirma).toLocaleString()}</p>}
//             </div>
//           )}

//           <h2>📝 Solicitud: {solicitud.titulo}</h2>
//           <p><strong>Descripción:</strong> {solicitud.descripcion}</p>
//           <p><strong>Monto:</strong> ${solicitud.monto.toLocaleString()}</p>
//           <p><strong>Solicitante:</strong> {solicitud.solicitante}</p>
//           <p><strong>Estado actual:</strong> {solicitud.estado}</p>
//           <hr />
//           <p><strong>Usted:</strong> {aprobador.nombre} ({aprobador.correo})</p>
//           <p><strong>Estado de su aprobación:</strong> {aprobador.estado}</p>

//           <button
//             onClick={() => manejarAccion('aprobar')}
//             style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', marginRight: 10, marginTop: 20 }}
//           >
//             ✅ Aprobar
//           </button>
//           <button
//             onClick={() => manejarAccion('rechazar')}
//             style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 20px', marginTop: 20 }}
//           >
//             ❌ Rechazar
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default AprobarSolicitud;

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { validarAcceso, firmarSolicitud } from '../services/api';

const AprobarSolicitud: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [tokenInput, setTokenInput] = useState('');
  const [tokenValidado, setTokenValidado] = useState(false);
  const [solicitud, setSolicitud] = useState<any>(null);
  const [aprobador, setAprobador] = useState<any>(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [fechaFirma, setFechaFirma] = useState('');
  const [loading, setLoading] = useState(false);

  const tokenFromURL = searchParams.get('approver_token');
  const solicitudId = searchParams.get('solicitud_id');

  useEffect(() => {
    if (tokenFromURL) setTokenInput(tokenFromURL);
  }, [tokenFromURL]);

  const validarToken = async () => {
    setError('');
    setMensaje('');
    setTokenValidado(false);
    setSolicitud(null);
    setAprobador(null);

    if (!tokenInput) {
      setError('Debe ingresar un token.');
      return;
    }

    setLoading(true);
    try {
      const parsed = await validarAcceso(tokenInput);
      if (!parsed || !parsed.solicitud || !parsed.aprobador) {
        throw new Error('Token no válido');
      }

      setSolicitud(parsed.solicitud);
      setAprobador(parsed.aprobador);
      setTokenValidado(true);
    } catch (err) {
      console.error('❌ Error al validar token:', err);
      setError('Token inválido o expirado.');
    } finally {
      setLoading(false);
    }
  };

  const manejarAccion = async (accion: 'aprobar' | 'rechazar') => {
    if (!tokenInput || !solicitudId) {
      setMensaje('Faltan datos para procesar la acción');
      return;
    }

    try {
      const res = await firmarSolicitud(solicitudId, tokenInput, accion);
      setMensaje(res.message || 'Acción registrada');
      setFechaFirma(res.fechaFirma || '');
    } catch (err) {
      console.error('❌ Error al firmar:', err);
      setMensaje('Error al registrar la acción');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      {!tokenValidado && (
        <>
          <h2>🔐 Validar acceso</h2>
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Ingrese el token"
            style={{ width: '100%', padding: 10, marginBottom: 10 }}
          />
          <button
            onClick={validarToken}
            style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px' }}
          >
            Validar Token
          </button>
          {loading && <p>Validando...</p>}
          {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
        </>
      )}

      {tokenValidado && solicitud && aprobador && (
        <>
          {mensaje && (
            <div
              style={{
                backgroundColor: mensaje.includes('Rechazado') ? '#ffe0e0' : '#e0ffe0',
                padding: '15px',
                marginBottom: '20px'
              }}
            >
              <p style={{ color: mensaje.includes('Rechazado') ? 'red' : 'green' }}>{mensaje}</p>
              {fechaFirma && <p><strong>Fecha de firma:</strong> {new Date(fechaFirma).toLocaleString()}</p>}
            </div>
          )}

          <h2>📝 Solicitud: {solicitud.titulo}</h2>
          <p><strong>Descripción:</strong> {solicitud.descripcion}</p>
          <p><strong>Monto:</strong> ${solicitud.monto.toLocaleString()}</p>
          <p><strong>Solicitante:</strong> {solicitud.solicitante}</p>
          <p><strong>Estado actual:</strong> {solicitud.estado}</p>
          <hr />
          <p><strong>Usted:</strong> {aprobador.nombre} ({aprobador.correo})</p>
          <p><strong>Estado de su aprobación:</strong> {aprobador.estado}</p>

          <button
            onClick={() => manejarAccion('aprobar')}
            style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', marginRight: 10, marginTop: 20 }}
          >
            ✅ Aprobar
          </button>
          <button
            onClick={() => manejarAccion('rechazar')}
            style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 20px', marginTop: 20 }}
          >
            ❌ Rechazar
          </button>
        </>
      )}
    </div>
  );
};

export default AprobarSolicitud;
