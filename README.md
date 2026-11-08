# Sistema de Gestion de Solicitudes - Frontend

Aplicacion SPA desarrollada con React 19, Vite y Tailwind CSS para la gestion de solicitudes y contactos.

## Requisitos
- Node.js 18 o superior
- npm 9 o superior

## Instalacion y Ejecucion
1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicacion abrira en `http://localhost:5173`.

## Comunicacion con el Backend
El archivo `vite.config.js` contiene la configuracion para reenviar las peticiones `/api/*` al backend en `http://localhost:8080`.

## Vistas Desarrolladas
- `/` o `/solicitudes`: Tabla general con ordenamiento por columnas (ascendente y descendente), filtros por tipo y fecha de envio, enlace directo al detalle por codigo autogenerado y boton de exportacion a CSV.
- `/solicitudes/nueva`: Formulario de registro con control de fecha (datepicker), bloqueo en tiempo real de caracteres no numéricos en el telefono, lista dinamica para agregar/eliminar contactos adicionales y confirmacion con código devuelto por el servidor.
- `/solicitudes/:codigo`: Ficha de detalle de la solicitud seleccionada y tabla con sus contactos adicionales registrados.
