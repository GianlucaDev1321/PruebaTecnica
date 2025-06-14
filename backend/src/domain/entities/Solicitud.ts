

export interface Solicitud {
  id: string;
  titulo: string;
  descripcion: string;
  monto: number;
  solicitante: string;
  estado: 'Pendiente' | 'Completada';
  // aprobadores: Aprobador[];
  fechaCreacion: string;
}

