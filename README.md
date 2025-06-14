# Prueba Técnica - Fiduoccidente 2025

# 📝 Flujo de Aprobaciones con Firma Digital

Este proyecto implementa un sistema de aprobaciones donde tres aprobadores deben firmar digitalmente una solicitud. Al completarse las firmas, se genera un PDF de evidencia que se almacena en S3 y puede descargarse mediante un endpoint seguro.

## 🛠️ Tecnologías y Arquitectura

- **Backend**: Node.js + TypeScript
- **Frontend**: React.js
- **Infraestructura**: AWS Lambda, API Gateway, DynamoDB, S3
- **Arquitectura**: Clean Architecture
- **Despliegue**: Serverless Framework
- **Testing**: Jest (Cobertura superior al 97%)

---

## 📁 Estructura del Proyecto

backend/
├── src/
│ ├── application/ # Casos de uso
│ ├── domain/ # Entidades y tipos
│ ├── infrastructure/
│ │ ├── db/dynamodb/ # Repositorios para DynamoDB
│ │ ├── s3/ # Generador de PDF
│ │ └── mail/ # Simulación de envío de correos
│ └── config/ # Configuración del proyecto
├── tests/ # Pruebas unitarias
├── serverless.yml # Configuración del despliegue



---

## ⚙️ Funcionalidades Principales

### ✅ Crear Solicitud
**POST /api/solicitudes**

- Registra una solicitud en estado **Pendiente**.
- Asocia 3 aprobadores.
- Genera tokens únicos (UUID) y links de firma.

### 🔐 Validar Acceso por OTP
**POST /api/solicitudes/validar-acceso**

- Recibe un token OTP.
- Verifica que el OTP sea válido y no haya expirado.
- Devuelve el `aprobadorId` asociado o error si es inválido o expirado.

### ✍️ Firmar Solicitud
**POST /api/firmar**

- Valida el token.
- Actualiza el estado del aprobador a **Firmado**.
- Si los 3 aprueban, actualiza la solicitud a **Completada**.
- Genera y almacena el PDF de evidencia en S3.

### 📥 Descargar PDF de Evidencia
**GET /api/solicitudes/{id}/evidencia.pdf**

- Devuelve una URL firmada de S3 para descargar el PDF de evidencia.

---

## 🔐 Seguridad y Tokens

- Los tokens OTP expiran a los **3 minutos**.
- Se almacena un registro temporal de OTP en DynamoDB con TTL.
- No se usa firma criptográfica, solo marcas de tiempo simuladas.

---

## 📦 Despliegue con Serverless Framework

### Requisitos

- Tener configurado AWS CLI
- Tener instalado Serverless Framework: `npm install -g serverless`

### Comandos útiles

```bash
sls deploy                         # Despliega todas las Lambdas
sls invoke -f createSolicitud      # Invoca función localmente
sls logs -f firmarSolicitud        # Ver logs de una función


🧪 Pruebas

npm install
npm test
npm run test:coverage


🔧 Endpoints Disponibles
Método	 Endpoint	                                    Descripción
POST	 /api/solicitudes	                            Crear una solicitud
POST	 /api/solicitudes/validar-acceso	            Validar token OTP
POST	 /api/firmar	                                Firmar solicitud con token
GET	     /api/solicitudes/{id}/evidencia.pdf	        Descargar evidencia en PDF desde S3



👨‍💻 Autor
Desarrollado por Gianluca Sanchez como parte de la prueba técnica para Fiduoccidente.