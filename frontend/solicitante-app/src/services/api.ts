import axios from 'axios';

const API_BASE = 'https://wkot1znpzj.execute-api.us-east-2.amazonaws.com/dev';

export const crearSolicitud = async (data: any) => {
  const response = await axios.post(`${API_BASE}/solicitudes`, data);
  return response.data;
};


export const obtenerSolicitudes = async () => {
  const res = await axios.get(`${API_BASE}/solicitudes`);
  return typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
};

export const descargarEvidencia = async (id: string) => {
  const API_BASE = 'https://wkot1znpzj.execute-api.us-east-2.amazonaws.com/dev';
  try {
    const res = await axios.get(`${API_BASE}/api/solicitudes/${id}/evidencia.pdf`);
    const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;

    if (data?.url) {
      window.open(data.url, '_blank');
    } else {
      alert('No se pudo obtener la URL del archivo');
    }
  } catch (err) {
    console.error('Error al descargar evidencia:', err);
    alert('Error al intentar descargar el PDF');
  }
};
