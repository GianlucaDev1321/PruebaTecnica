
import { Aprobador } from '../../domain/entities/Aprobador';
import { Solicitud } from '../../domain/entities/Solicitud';

export interface FirmarSolicitudInput {
  solicitudId: string;
  aprobadorId: string;
  accion: 'aprobar' | 'rechazar';
}

export interface FirmarSolicitudDeps {
  obtenerSolicitudPorId: (id: string) => Promise<Solicitud | null>;
  actualizarEstadoSolicitud: (id: string, estado: string) => Promise<void>;
  actualizarEstadoAprobador: (id: string, estado: string, fechaFirma: string) => Promise<void>;
  obtenerFirmadosPorSolicitud: (solicitudId: string) => Promise<Aprobador[]>;
  obtenerAprobadorPorId: (id: string) => Promise<Aprobador | null>;
  obtenerAprobadoresPorSolicitud: (solicitudId: string) => Promise<Aprobador[]>;
  generarPdfEvidencia: (solicitud: Solicitud, aprobadores: Aprobador[]) => Promise<void>;
}

export const firmarSolicitud = async (
  data: FirmarSolicitudInput,
  deps: FirmarSolicitudDeps
) => {
  const { solicitudId, aprobadorId, accion } = data;

  console.log(`🟢 Iniciando firma de solicitud ${solicitudId} por aprobador ${aprobadorId}`);

  const solicitud = await deps.obtenerSolicitudPorId(solicitudId);
  if (!solicitud) {
    console.warn('⚠️ Solicitud no encontrada');
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Solicitud no encontrada' }),
    };
  }

  const aprobador = await deps.obtenerAprobadorPorId(aprobadorId);
  if (!aprobador) {
    console.warn('⚠️ Aprobador no pertenece a esta solicitud');
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Aprobador no pertenece a esta solicitud' }),
    };
  }

  if (aprobador.estado !== 'Pendiente') {
    console.warn('⚠️ Esta aprobación ya fue procesada');
    return {
      statusCode: 409,
      body: JSON.stringify({ message: 'Esta aprobación ya fue procesada' }),
    };
  }

  const nuevoEstado = accion === 'aprobar' ? 'Firmado' : 'Rechazado';
  const fechaFirma = new Date().toISOString();

  console.log(`✍️ Aprobador ${aprobadorId} marcando como ${nuevoEstado}`);
  await deps.actualizarEstadoAprobador(aprobadorId, nuevoEstado, fechaFirma);

  const firmados = await deps.obtenerFirmadosPorSolicitud(solicitudId);
  console.log(`🔎 Aprobadores firmados (${firmados.length}):`, firmados.map(a => a.id));

  if (firmados.length === 3) {
    console.log('✅ Todos los aprobadores firmaron. Actualizando solicitud a Completada');
    await deps.actualizarEstadoSolicitud(solicitudId, 'Completada');

    console.log('📦 Obteniendo aprobadores completos para PDF...');
    const aprobadoresFull = await deps.obtenerAprobadoresPorSolicitud(solicitudId);
    const solicitudActualizada = await deps.obtenerSolicitudPorId(solicitudId);

    if (solicitudActualizada) {
      console.log('🧾 Generando PDF de evidencia...');
      await deps.generarPdfEvidencia(solicitudActualizada, aprobadoresFull);
      console.log('📤 PDF generado y enviado a S3 correctamente');
    } else {
      console.warn('⚠️ No se pudo obtener la solicitud actualizada para el PDF');
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Aprobación registrada como ${nuevoEstado}`,
      fechaFirma,
    }),
  };
};
