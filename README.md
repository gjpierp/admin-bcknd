# Documentación Completa del Proyecto

Este README concentra y enlaza toda la documentación disponible en `documentation/`.

## 🚀 Quick Start

### Requisitos

- Node.js 18+ (recomendado)
- MySQL 8

### Instalación

```bash
npm install
```

### Configurar entorno (`.env`)

Ejemplo mínimo:

```env
PORT=3005
DB_HOST=localhost
DB_USER=admin_bcknd
DB_PASSWORD=####
DB_NAME=#####
JWT_SECRET=your_jwt_secret_key_2025
GOOGLE_ID=tu_google_client_id
FACEBOOK_APP_ID=tu_facebook_app_id
FACEBOOK_APP_SECRET=tu_facebook_app_secret
```

### Ejecutar

```bash
# Desarrollo (hot reload)
npm run start:dev

# Producción / ejecución simple
npm start
```

### Base de datos

- Importa los esquemas desde la carpeta `database/` según el módulo:
  - `schema-completo.sql`
  - `schema-division-territorial.sql`
  - `schema-multi-sitios.sql`
  - `schema-traducciones.sql`
- Scripts adicionales en `documentation/Sql/` (p.ej., `mensajes-autenticacion.sql`).

### Postman

- Colecciones en `documentation/Postman/`.
- La colección completa auto-inyecta `x-token` vía pre-request; solo omite `POST /api/login`.
- Tras login/renew, el token se guarda en la variable `token`.

## Índice

- Configuración de la Base de Datos (documentation/README.md)
- Actualización Auth con Traducciones (documentation/ACTUALIZACION_AUTH_TRADUCCIONES.md)
- Configuración Google Identity (documentation/GOOGLE_IDENTITY_SETUP.md)
- Configuración Facebook Auth (documentation/FACEBOOK_AUTH_SETUP.md)
- Guía Postman (documentation/GUIA_POSTMAN.md)
- Reporte de Validación (documentation/REPORTE_VALIDACION.md)
- Sistema Gestor de Contraseñas (documentation/SISTEMA_GESTOR_CONTRASEÑAS.md)
- Sistema Multi Sitios (documentation/SISTEMA_MULTI_SITIOS.md)
- Sistema Roles y Permisos (documentation/SISTEMA_ROLES_PERMISOS.md)
- Sistema de Traducciones (documentation/SISTEMA_TRADUCCIONES.md)
- API de Territorios (documentation/TERRITORIOS_API.md)
- Validaciones de Seguridad (documentation/VALIDACIONES_SEGURIDAD.md)

---

## Configuración de la Base de Datos (resumen)

Consulta el detalle completo en `documentation/README.md`. Incluye:

- Instalación MySQL (Windows/Linux/macOS)
- Usuario `admin_bcknd` y permisos
- Creación de esquema y verificación
- Estructura de tabla `usuarios` e índices
- Procedimientos almacenados y vistas
- Respaldos, restauración y exportación
- Variables de entorno `.env`
- Consultas útiles, optimización y solución de problemas

---

## Enlaces a documentación detallada

- Actualización Auth con Traducciones: `documentation/ACTUALIZACION_AUTH_TRADUCCIONES.md`
- Google Identity Setup: `documentation/GOOGLE_IDENTITY_SETUP.md`
- Facebook Auth Setup: `documentation/FACEBOOK_AUTH_SETUP.md`
- Guía Postman: `documentation/GUIA_POSTMAN.md`
- Reporte de Validación: `documentation/REPORTE_VALIDACION.md`
- Sistema Gestor de Contraseñas: `documentation/SISTEMA_GESTOR_CONTRASEÑAS.md`
- Sistema Multi Sitios: `documentation/SISTEMA_MULTI_SITIOS.md`
- Sistema Roles y Permisos: `documentation/SISTEMA_ROLES_PERMISOS.md`
- Sistema de Traducciones: `documentation/SISTEMA_TRADUCCIONES.md`
- API de Territorios: `documentation/TERRITORIOS_API.md`
- Validaciones de Seguridad: `documentation/VALIDACIONES_SEGURIDAD.md`

---

## Contenido Integrado

A continuación se integra el contenido esencial de los archivos `.md` de `documentation/` para consulta rápida.

### Overview del Proyecto

- Backend Node.js/Express con MySQL2 y JWT.
- Módulos: Auth (local/Google/Facebook), RBAC (roles/permisos/menús), Traducciones multiidioma, Territorios, Multi‑sitios, Gestor de contraseñas.
- Middlewares: validación de inputs, JWT, permisos, manejo de errores, idioma.
- Postman: colecciones completas con pre-request para token.

### Estructura de carpetas (resumen)

```
index.js
package.json
controllers/     # Lógica de negocio por módulo
database/        # Config y esquemas SQL
documentation/   # Manuales y guías (MD)
helpers/         # Utilidades (JWT, traducciones, etc.)
middlewares/     # Validación, idioma, errores
models/          # Acceso a datos (MySQL)
public/          # Página pública de demo
routes/          # Definición de endpoints
uploads/         # Almacenamiento de archivos
```

### Extracto: Configuración de la Base de Datos

Nombre BD: `db_admin_bcknd`. Creación de usuario `admin_bcknd`, permisos y scripts de esquema. Variables `.env` para conexión, ejemplos de consultas y mantenimiento.

### Extracto: Actualización Auth con Traducciones

Middleware `capturarIdioma`, helper de traducciones y mensajes multilingües para Auth (login, Google, Facebook, renew). Idiomas soportados: es, en, pt, fr, de, it, zh, ja.

### Extracto: Google Identity Services

Implementación One Tap y botón personalizado; ejemplos en Vanilla y React; validación backend y mejores prácticas.

### Extracto: Facebook Auth

Creación de app, SDK, botón login, endpoint `/api/login/facebook`, variables `.env` y solución de problemas.

### Extracto: Guía Postman

Importación de colección, variables, flujo de pruebas (crear usuario, login, CRUD roles/permisos/menús), errores comunes y solución.

### Extracto: Reporte de Validación

Fortalezas, observaciones (rate limiting, helmet, logs, .env.example), plan de acción por fases y checklist de seguridad.

### Extracto: Gestor de Contraseñas

Entidades, buenas prácticas de cifrado extremo a extremo, ACL y consultas útiles.

### Extracto: Sistema Multi‑Sitios

Tenants, entornos, aplicaciones, sitios, dominios, páginas, rutas, menús, integraciones, despliegues y autorización multi‑tenant.

### Extracto: Roles y Permisos

RBAC completo: endpoints, middlewares, auditoría y ejemplos de uso.

### Extracto: Sistema de Traducciones

Estructura, instalación, configuración, uso en frontend/backend y API de traducciones.

### Extracto: API de Territorios

Jerarquías, endpoints públicos/protegidos, filtros, estructura de BD y ejemplos de código.

### Extracto: Validaciones de Seguridad

Validaciones de JWT, inputs, paginación, territorios, usuarios, roles, permisos, menús; manejador global de errores y protecciones contra SQLi/XSS/DoS.
