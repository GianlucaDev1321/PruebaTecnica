export interface GetPdfEvidenciaDeps {
  generarUrlFirmada: (key: string) => Promise<string>;
}

export const getPdfEvidenciaSolicitud = async (
  solicitudId: string,
  deps: GetPdfEvidenciaDeps
) => {
  if (!solicitudId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'ID de solicitud requerido' }),
    };
  }

  const key = `evidencias/${solicitudId}.pdf`;

  try {
    const url = await deps.generarUrlFirmada(key);

    return {
      statusCode: 200,
      body: JSON.stringify({ url }),
    };
  } catch (error) {
    console.error('❌ Error generando URL firmada:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error generando la URL del PDF' }),
    };
  }
};
