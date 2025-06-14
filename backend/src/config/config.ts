export const config = {
    awsRegion: process.env.AWS_REGION || 'us-east-2',
  solicitudesTable: process.env.SOLICITUDES_TABLE || 'Solicitudes',
  aprobadoresTable: process.env.APROBADORES_TABLE || 'Aprobadores',
  otpTable: process.env.OTP_TABLE || 'OTP',
  bucketEvidencias: process.env.EVIDENCIAS_BUCKET || 'fidu-evidencias-pdf',
};
