import axios from 'axios';

const API_BASE = 'https://wkot1znpzj.execute-api.us-east-2.amazonaws.com/dev';

export const validarAcceso = async (token: string) => {
  const response = await axios.get(`${API_BASE}/solicitudes/validar-acceso?token=${token}`);
  return JSON.parse(response.data.body);
};

export const firmarSolicitud = async (
  solicitudId: string,
  token: string,
  accion: 'aprobar' | 'rechazar'
) => {
  const response = await axios.post(`${API_BASE}/solicitudes/firma`, {
    solicitudId,
    token,
    accion
  });
  return response.data;
};
