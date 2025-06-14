import { getPdfEvidenciaSolicitud } from '../../src/application/usecases/descargarPdf.usecase';

describe('getPdfEvidenciaSolicitud', () => {
  const mockDeps = {
    generarUrlFirmada: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería retornar 400 si no se pasa solicitudId', async () => {
    const result = await getPdfEvidenciaSolicitud('', mockDeps);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('ID de solicitud requerido');
  });

  it('debería retornar la URL firmada si todo está bien', async () => {
    const solicitudId = 'abc123';
    const mockUrl = 'https://s3-bucket.com/evidencias/abc123.pdf';
    mockDeps.generarUrlFirmada.mockResolvedValueOnce(mockUrl);

    const result = await getPdfEvidenciaSolicitud(solicitudId, mockDeps);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.url).toBe(mockUrl);
    expect(mockDeps.generarUrlFirmada).toHaveBeenCalledWith(`evidencias/${solicitudId}.pdf`);
  });

  it('debería retornar 500 si ocurre un error al generar la URL', async () => {
    mockDeps.generarUrlFirmada.mockRejectedValueOnce(new Error('Fallo'));

    const result = await getPdfEvidenciaSolicitud('fail123', mockDeps);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Error generando la URL del PDF');
  });
});
