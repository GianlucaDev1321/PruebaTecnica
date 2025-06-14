export interface Aprobador {
  id: string;
  nombre: string;
  correo: string;
  estado: 'Pendiente' | 'Firmado' | 'Rechazado';
  token: string;
  fechaFirma?: string;
  solicitudId: string;
}