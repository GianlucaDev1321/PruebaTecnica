// // src/pages/ListarSolicitudes.tsx
// import React, { useEffect, useState } from 'react';
// import { obtenerSolicitudes, descargarEvidencia } from '../services/api';

// const ListarSolicitudes: React.FC = () => {
//   const [solicitudes, setSolicitudes] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSolicitudes = async () => {
//       try {
//         const data = await obtenerSolicitudes();
//         setSolicitudes(data);
//       } catch (error) {
//         console.error('Error obteniendo solicitudes:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSolicitudes();
//   }, []);

//   return (
//     <div style={{ padding: 30 }}>
//       <h2>📄 Solicitudes registradas</h2>

//       {loading && <p>Cargando...</p>}

//       {!loading && solicitudes.length === 0 && <p>No hay solicitudes registradas.</p>}

//       {!loading && solicitudes.length > 0 && (
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr>
//               <th>Título</th>
//               <th>Solicitante</th>
//               <th>Estado</th>
//               <th>Monto</th>
//               <th>Fecha</th>
//               <th>Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {solicitudes.map((s) => (
//               <tr key={s.id}>
//                 <td>{s.titulo}</td>
//                 <td>{s.solicitante}</td>
//                 <td>{s.estado}</td>
//                 <td>${s.monto?.toLocaleString?.()}</td>
//                 <td>{new Date(s.fechaCreacion).toLocaleString()}</td>
//                 <td>
//                   {s.estado === 'Completada' && (
//                     <button onClick={() => descargarEvidencia(s.id)}>📥 Descargar PDF</button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default ListarSolicitudes;
// src/pages/Solicitudes.tsx
import { useEffect, useState } from 'react';
import { obtenerSolicitudes, descargarEvidencia } from '../services/api';
import { normalizarDynamoItem } from '../utils/normalizarDynamoItem';

interface Solicitud {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  [key: string]: any;
}

const Solicitudes = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarSolicitudes = async () => {
      try {
        const data = await obtenerSolicitudes();
        const normalizadas = data.map((item: any) => normalizarDynamoItem(item));
        setSolicitudes(normalizadas);
      } catch (err) {
        console.error('Error al cargar solicitudes:', err);
        setError('No se pudieron cargar las solicitudes');
      }
    };

    cargarSolicitudes();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>📄 Solicitudes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Título</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Descripción</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Estado</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((solicitud) => (
            <tr key={solicitud.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{solicitud.id}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{solicitud.titulo}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{solicitud.descripcion}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{solicitud.estado}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {solicitud.estado === 'Completada' ? (
                  <button
                    onClick={() => descargarEvidencia(solicitud.id)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    📥 Descargar PDF
                  </button>
                ) : (
                  <span style={{ color: '#888' }}>No disponible</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Solicitudes;
