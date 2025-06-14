// // infrastructure/s3/pdfGenerator.ts
// import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { config } from '../../config/config';
// import { Solicitud } from '../../domain/entities/Solicitud';
// import { Aprobador } from '../../domain/entities/Aprobador';

// const s3 = new S3Client({ region: config.awsRegion });

// export const generarPdfEvidencia = async (
//   solicitud: Solicitud,
//   aprobadores: Aprobador[]
// ): Promise<void> => {
//   try {
//     console.log('🧾 Generando PDF...');

//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage();
//     const { width, height } = page.getSize();

//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const fontSize = 12;
//     let y = height - 50;

//     page.drawText('Evidencia de Solicitud de Compra', {
//       x: 50,
//       y,
//       size: 18,
//       font,
//       color: rgb(0, 0, 0),
//     });

//     y -= 40;
//     page.drawText(`Título: ${solicitud.titulo}`, { x: 50, y, size: fontSize, font });
//     y -= 20;
//     page.drawText(`Descripción: ${solicitud.descripcion}`, { x: 50, y, size: fontSize, font });
//     y -= 20;
//     page.drawText(`Monto: $${solicitud.monto}`, { x: 50, y, size: fontSize, font });
//     y -= 20;
//     page.drawText(`Solicitante: ${solicitud.solicitante}`, { x: 50, y, size: fontSize, font });
//     y -= 20;
//     page.drawText(`Fecha: ${new Date(solicitud.fechaCreacion).toLocaleString()}`, {
//       x: 50,
//       y,
//       size: fontSize,
//       font,
//     });

//     y -= 40;
//     page.drawText('Firmas:', { x: 50, y, size: fontSize, font });

//     aprobadores.forEach((a, index) => {
//       y -= 20;
//       page.drawText(`${index + 1}. ${a.nombre} - ${a.estado} - ${a.fechaFirma || '---'}`, {
//         x: 60,
//         y,
//         size: fontSize,
//         font,
//       });
//     });

//     const pdfBytes = await pdfDoc.save();
//     console.log(`📄 PDF generado (bytes: ${pdfBytes.length})`);

//     const key = `evidencias/${solicitud.id}.pdf`;
//     const bucket = config.bucketEvidencias;

//     await s3.send(
//       new PutObjectCommand({
//         Bucket: bucket,
//         Key: key,
//         Body: Buffer.from(pdfBytes),
//         ContentType: 'application/pdf',
//       })
//     );

//     console.log(`✅ PDF subido a S3 en ${bucket}/${key}`);
//   } catch (error) {
//     console.error('❌ Error al generar o subir el PDF:', error);
//     throw new Error('No se pudo generar ni subir el PDF');
//   }
// };


// infrastructure/s3/pdfGenerator.ts
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../../config/config';
import { Solicitud } from '../../domain/entities/Solicitud';
import { Aprobador } from '../../domain/entities/Aprobador';

const s3 = new S3Client({ region: config.awsRegion });

export const generarPdfEvidencia = async (
  solicitud: Solicitud,
  aprobadores: Aprobador[]
): Promise<void> => {
  try {
    console.log('🧾 Generando PDF...');

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    let y = height - 50;

    page.drawText('Evidencia de Solicitud de Compra', {
      x: 50,
      y,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });

    y -= 40;
    page.drawText(`Título: ${solicitud.titulo}`, { x: 50, y, size: fontSize, font });
    y -= 20;
    page.drawText(`Descripción: ${solicitud.descripcion}`, { x: 50, y, size: fontSize, font });
    y -= 20;
    page.drawText(`Monto: $${solicitud.monto}`, { x: 50, y, size: fontSize, font });
    y -= 20;
    page.drawText(`Solicitante: ${solicitud.solicitante}`, { x: 50, y, size: fontSize, font });
    y -= 20;
    page.drawText(`Fecha: ${new Date(solicitud.fechaCreacion).toLocaleString()}`, {
      x: 50,
      y,
      size: fontSize,
      font,
    });

    y -= 40;
    page.drawText('Firmas:', { x: 50, y, size: fontSize, font });

    aprobadores.forEach((a, index) => {
      y -= 20;
      page.drawText(`${index + 1}. ${a.nombre} - ${a.estado} - ${a.fechaFirma || '---'}`, {
        x: 60,
        y,
        size: fontSize,
        font,
      });
    });

    const pdfBytes = await pdfDoc.save();
    console.log(`📄 PDF generado (bytes: ${pdfBytes.length})`);

    const key = `evidencias/${solicitud.id}.pdf`;
    const bucket = config.bucketEvidencias;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: Buffer.from(pdfBytes),
        ContentType: 'application/pdf',
      })
    );

    console.log(`✅ PDF subido a S3 en ${bucket}/${key}`);
  } catch (error) {
    console.error('❌ Error al generar o subir el PDF:', error);
    throw new Error('No se pudo generar ni subir el PDF');
  }
};

export const generarUrlFirmada = async (key: string): Promise<string> => {
  try {
    console.log(`🔗 Generando URL firmada para: ${key}`);

    const command = new GetObjectCommand({
      Bucket: config.bucketEvidencias,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // 5 min
    console.log('✅ URL firmada generada:', url);

    return url;
  } catch (error) {
    console.error('❌ Error generando URL firmada:', error);
    throw new Error('No se pudo generar la URL firmada');
  }
};
