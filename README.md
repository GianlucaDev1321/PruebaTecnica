# Prueba Técnica - Fiduoccidente 2025

# 📝 Flujo de Aprobaciones con Firma Digital

Este proyecto implementa un sistema de aprobaciones donde tres aprobadores deben firmar digitalmente una solicitud. Al completarse las firmas, se genera un PDF de evidencia que se almacena en S3 y puede descargarse mediante un endpoint seguro.

## 🛠️ Tecnologías 

- **Backend**: Node.js + TypeScript
- **Frontend**: React.js
- **Infraestructura**: AWS Lambda, API Gateway, DynamoDB, S3
- **Despliegue**: Serverless Framework
- **Testing**: Jest y Vitest

---

## 📁 Estructura del Proyecto

## Estructura del Backend
backend/
│
├── .serverless/
├── coverage/
├── node_modules/
├── src/
│   ├── application/
│   │   ├── dtos/
│   │   └── usecases/
│   ├── config/
│   │   └── config.ts
│   ├── domain/
│   │   └── entities/
│   │       ├── Aprobador.ts
│   │       └── Solicitud.ts
│   ├── infrastructure/
│   │   ├── db/
│   │   ├── mail/
│   │   └── s3/
│   ├── interfaces/
│   │   └── handlers/
│   │       ├── createSolicitud.ts
│   │       ├── descargarPdf.ts
│   │       ├── firmarSolicitud.ts
│   │       ├── listarSolicitudes.ts
│   │       └── validarAcceso.ts
│   └── tests/
├── .gitignore
├── jest.config.js
├── package.json
├── package-lock.json
├── serverless.yml
├── tsconfig.json
└── README.md


## Estructura del Frontend (Microfrontends)
frontend/
│
├── aprobador-app/
│   ├── coverage/
│   ├── dist/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── test/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── vitest.setup.ts
│
├── shell-app/
│   └── ...estructura similar...
│
├── solicitante-app/
│   └── ...estructura similar...
│
└── README.md

---

## 🧠 Supuestos y Decisiones de Implementación

- El flujo requiere **exactamente 3 aprobadores** por cada solicitud.
- El envío de emails de aprobación es **simulado** y queda registrado en logs.
- El **OTP** es único para cada aprobador y válido por 3 minutos.
- El PDF de evidencias se genera automáticamente cuando los 3 aprobadores han firmado.
- El frontend usa microfrontends para separar los flujos de aprobador y solicitante.
- Los test cubren al menos el 60% de los casos.



| Método | Endpoint                                    | Descripción                                     | Entrada (Body/Params)                                                                                                                                          | Respuesta (Ejemplo)                                                                                                                   |
| ------ | ------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/solicitudes`                              | Crear nueva solicitud de compra                 | JSON: <br> <pre>{ "titulo": "...", "descripcion": "...", "monto": 0, "solicitante": "...", "aprobadores": \[ {"nombre": "...", "correo": "..."}, ... ] }</pre> | <pre>{ "solicitudId": "...", "mensaje": "...", "links": \[ "[https://dominio.com/approve](https://dominio.com/approve)?..." ] }</pre> |
| GET    | `/solicitudes`                              | Listar todas las solicitudes (para solicitante) | —                                                                                                                                                              | Array de solicitudes<br><pre>\[{"id": {"S": "..."}, ... }]</pre>                                                                      |
| GET    | `/solicitudes/validar-acceso?token={token}` | Validar token de aprobador y obtener detalle    | Param: token (en query)                                                                                                                                        | <pre>{ "aprobador": { ... }, "solicitud": { ... } }</pre>                                                                             |
| POST   | `/solicitudes/firma`                        | Firmar o rechazar una solicitud                 | JSON: <br><pre>{ "solicitudId": "...", "token": "...", "accion": "aprobar" }</pre>                                                                             | <pre>{ "message": "...", "fechaFirma": "..." }</pre>                                                                                  |
| GET    | `/api/solicitudes/{id}/evidencia.pdf`       | Descargar PDF de evidencias                     | Param: id (en path)                                                                                                                                            | <pre>{ "url": "[https://...amazonaws.com/...pdf](https://...amazonaws.com/...pdf)?..." }</pre>                                        |





---

## 🧪 Cómo probar los endpoints (Postman/curl)

### 1. Crear una Solicitud

**POST /solicitudes**

#### Usando curl:
```bash
curl -X POST https://<TU-API-GATEWAY>/solicitudes \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Compra de equipos 2",
    "descripcion": "Adquisición de 3 laptops",
    "monto": 4500000,
    "solicitante": "carlos@example.com",
    "aprobadores": [
      { "nombre": "Juan", "correo": "juan@example.com" },
      { "nombre": "Ana", "correo": "ana@example.com" },
      { "nombre": "Luis", "correo": "luis@example.com" }
    ]
  }'
```

Usando Postman:
1. Crea una nueva petición POST.

2. URL: https://<TU-API-GATEWAY>/solicitudes

3. Body → raw → JSON:
```bash
{
  "titulo": "Compra de equipos 2",
  "descripcion": "Adquisición de 3 laptops",
  "monto": 4500000,
  "solicitante": "carlos@example.com",
  "aprobadores": [
    { "nombre": "Juan", "correo": "juan@example.com" },
    { "nombre": "Ana", "correo": "ana@example.com" },
    { "nombre": "Luis", "correo": "luis@example.com" }
  ]
}
```
4. Presiona Send y observa la respuesta.

2. Validar acceso de un aprobador
GET /solicitudes/validar-acceso?token={token}

```bash
curl "https://<TU-API-GATEWAY>/solicitudes/validar-acceso?token=<TOKEN>"
```

3. Firmar o rechazar una solicitud
POST /solicitudes/firma

```bash
curl -X POST https://<TU-API-GATEWAY>/solicitudes/firma \
  -H "Content-Type: application/json" \
  -d '{
    "solicitudId": "ID_SOLICITUD",
    "token": "TOKEN_APROBADOR",
    "accion": "aprobar"
  }'
```


4. Descargar PDF de evidencias
GET /api/solicitudes/{id}/evidencia.pdf

```bash
curl "https://<TU-API-GATEWAY>/api/solicitudes/ID_SOLICITUD/evidencia.pdf"
```


5. Listar todas las solicitudes
GET /solicitudes

```bash
curl "https://<TU-API-GATEWAY>/solicitudes"
```


🚀 Instalación y Despliegue
Backend
Instalar dependencias

```bash
cd backend
npm install
```
Desplegar en AWS usando Serverless Framework

```bash
serverless deploy
```

Esto crea todos los recursos necesarios en AWS (Lambdas, API Gateway, DynamoDB, S3).

Variables de entorno por defecto

Las tablas de DynamoDB y el bucket S3 se crean automáticamente.

Puedes personalizar los nombres en serverless.yml según tu entorno.

CORS

Durante el desarrollo, los endpoints permiten solicitudes desde cualquier origen (origin: '*'), para facilitar las pruebas desde local o desde cualquier frontend.

En producción, se recomienda restringir los orígenes a dominios autorizados.



🌍 URLs de despliegue en la nube
Backend (API Gateway):

```bash
POST   https://wkot1znpzj.execute-api.us-east-2.amazonaws.com/dev/solicitudes
GET    https://wkot1znpzj.execute-api.us-east-2.amazonaws.com/dev/solicitudes/validar-acceso
POST   https://wkot1znpzj.execute-api.us-east-2.amazonaws.com/dev/solicitudes/firma
GET    https://wkot1znpzj.execute-api.us-east-2.amazonaws.com/dev/api/solicitudes/{id}/evidencia.pdf
GET    https://wkot1znpzj.execute-api.us-east-2.amazonaws.com/dev/solicitudes
```








Desarrollado por Gianluca Sanchez como parte de la prueba técnica para Fiduoccidente.
