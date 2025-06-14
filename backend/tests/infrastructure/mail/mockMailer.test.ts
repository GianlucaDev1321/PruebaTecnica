import { enviarCorreoSimulado } from '../../../src/infrastructure/mail/mockMailer';

describe('mockMailer', () => {
  it('debería simular el envío de correo correctamente', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await enviarCorreoSimulado('test@example.com', 'http://link.com');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Enviando correo a test@example.com con link: http://link.com'
    );

    consoleSpy.mockRestore();
  });
});
