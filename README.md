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
```bash
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
```

## Estructura del Frontend (Microfrontends)
```bash
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
```
---

## 🧠 Supuestos y Decisiones de Implementación

- El flujo requiere **exactamente 3 aprobadores** por cada solicitud.
- El envío de emails de aprobación es **simulado** y queda registrado en logs.
- El **OTP** es único para cada aprobador y válido por 3 minutos.
- El PDF de evidencias se genera automáticamente cuando los 3 aprobadores han firmado.
- El frontend usa microfrontends para separar los flujos de aprobador y solicitante.
- Los test cubren al menos el 60% de los casos.




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

Frontend



🧪 Pruebas y Cobertura (Backend)
El backend está cubierto con pruebas unitarias usando Jest, enfocadas en los casos de uso principales y la lógica de negocio.
Se mantiene una cobertura superior al 60%, como lo exige la prueba.

Framework: Jest

Ubicación de tests:

Carpeta src/tests/ (organizada por casos de uso, repos, etc.)

▶️ ¿Cómo ejecutar los tests?
Instala las dependencias (si no lo has hecho):


```bash

npm install

```


El backend cuenta con pruebas unitarias robustas usando Jest, superando ampliamente el objetivo mínimo exigido en la prueba técnica.

Framework: Jest

Ubicación: src/tests/

Cobertura total:

Statements: 94.7%

Branches: 82.45%

Functions: 91.89%

Lines: 94.9%

📦 Estructura de tests
Casos de uso: 100% cubiertos (application/usecases)

Servicios/Repositorios: cobertura alta (>90% en general)

Mocks y configuración: 100% cubiertos

▶️ Ejecutar los tests

```bash
npm install
npm run test         # Corre todos los tests
npm run test:coverage  # Genera reporte de cobertura
```



-----------------------------|---------|----------|---------|---------|
File                         | % Stmts | % Branch | % Funcs | % Lines |
-----------------------------|---------|----------|---------|---------|
All files                    |   94.7  |   82.45  |  91.89  |   94.9  |
application/usecases         |  98.88  |   92.59  |   100   |  98.79  |
config                       |   100   |   100    |   100   |   100   |
infrastructure/db/dynamodb   |  90.42  |   60     |   88    |  90.14  |
infrastructure/mail          |   100   |   100    |   100   |   100   |
-----------------------------|---------|----------|---------|---------|
Test Suites: 8 passed, 8 total
Tests:       30 passed, 30 total
Time:        10.875 s


🖥️ Frontend (Microfrontends)
El frontend está dividido en microfrontends usando React + Vite, para separar el flujo de solicitante y aprobador, además de una ShellApp para la integración.

📦 Estructura
shell-app: Microfrontend principal (shell), orquestador de los submódulos.

aprobador-app: Microfrontend para el flujo de aprobadores (validación de token, firma/rechazo).

solicitante-app: Microfrontend para el solicitante (crear, listar solicitudes, descargar PDF).


```bash
frontend/
├── shell-app/
├── aprobador-app/
├── solicitante-app/
└── README.md
```

🛠️ Tecnologías principales
Framework: React 19 + Vite

Librerías: React Router, axios

Testing: Vitest + @testing-library/react

🧪 Pruebas en el Frontend
Cada microfrontend cuenta con pruebas unitarias cubriendo los principales flujos y componentes, usando Vitest y Testing Library.

Ubicación: Dentro de cada microfrontend, en la carpeta /test/ o /src/__tests__/

Cobertura: Superior al 60% en los componentes y servicios principales.

▶️ ¿Cómo ejecutar los tests?
Ejemplo para solicitante-app (repite en cada microfrontend):
```bash
cd frontend/solicitante-app
npm install
npm run test
# Para ver cobertura
npm run coverage
```

--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |   84.93 |   92.72  |   95    |  84.93  |
src/pages                 |   98.97 |   96.15  |  100    |  98.97  |
src/routes                |   100   |   100    |  100    |  100    |
src/services              |   100   |   83.33  |  100    |  100    |
src/utils                 |   100   |   100    |  100    |  100    |
--------------------------|---------|----------|---------|---------|
Test Files: 6 passed (6)
Tests:      17 passed (17)



Comentario: El despligue de los microfrontend se realizo manualmente, Creando un bucket S3 en el cual se alojan los 3 MicroFrontend y haciendo la configuracion de cloudfront

```bash
https://d1c7drnfc9stg6.cloudfront.net/
```



Desarrollado por Gianluca Sanchez como parte de la prueba técnica para Fiduoccidente.
