export interface CreateSolicitudDTO {
  titulo: string;
  descripcion: string;
  monto: number;
  solicitante: string;
  aprobadores: { nombre: string; correo: string }[];
}