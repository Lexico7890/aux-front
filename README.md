# PWA Inventario Patinetas

Una Progressive Web App moderna para gestión de inventario en talleres de patinetas eléctricas, construida con Astro + React.

## 🚀 Características

- **Comando por Voz**: Reconocimiento de voz para comandos rápidos
- **PWA Completa**: Funciona offline y se puede instalar en móviles
- **UI Moderna**: Diseño limpio con TailwindCSS
- **Tiempo Real**: Comunicación con backend FastAPI
- **Multiplataforma**: Funciona en web, móvil y desktop

## 📋 Funcionalidades

### 🎤 Pantalla Principal
- Botón de micrófono central para comandos de voz
- Campo de texto para comandos manuales
- Respuestas en tiempo real
- Acciones rápidas predefinidas

### 📦 Inventario
- Vista de stock actual con filtros
- Búsqueda rápida
- Estados de stock (bajo, medio, OK)
- Categorización por ubicación

### 🔄 Movimientos
- Formularios para transferencias
- Historial de movimientos recientes
- Validación en tiempo real

### 📤 Documentos
- Drag & drop para archivos PDF/Excel
- Progreso de subida visual
- Historial de procesamiento

### 👥 Clientes en Espera
- Lista de espera de clientes
- Sistema de prioridades
- Notificaciones automáticas

### 🔔 Notificaciones
- Historial completo de notificaciones
- Estados de entrega (enviado, leído, error)
- Múltiples canales (Email, WhatsApp, SMS)

## 🛠 Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## 🏗 Arquitectura

```
src/
├── components/           # Componentes React reutilizables
│   ├── Navigation.jsx   # Navegación principal
│   ├── VoiceCommand.jsx # Comando de voz
│   ├── InventoryTable.jsx
│   ├── MovementForm.jsx
│   └── FileUpload.jsx
├── pages/               # Páginas Astro (rutas)
│   ├── index.astro     # Pantalla principal
│   ├── inventario.astro
│   ├── movimientos.astro
│   ├── documentos.astro
│   ├── clientes.astro
│   └── notificaciones.astro
└── layouts/
    └── Layout.astro    # Layout base con PWA setup
```

## 📱 PWA Setup

La app incluye:
- Service Worker para cache offline
- Web App Manifest
- Instalación automática en móviles
- Íconos adaptivos
- Modo standalone

## 🔧 Configuración

### Variables de Entorno
```bash
PUBLIC_API_URL=http://localhost:8000
```

### Integración con Backend
La app está preparada para conectarse con FastAPI:
- API REST para operaciones CRUD
- WebSocket para tiempo real
- Autenticación JWT (opcional)
- Upload de archivos

## 🎯 Comandos de Voz Soportados

- "Agregar 5 baterías al taller Medellín"
- "Consultar stock de ruedas"
- "Mover 2 controladores a técnico Juan"
- "Notificar cliente María González"

## 📊 Rendimiento

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Lighthouse Score**: 90+

## 🚀 Despliegue

Compatible con:
- Vercel (recomendado)
- Netlify
- GitHub Pages
- Docker

```bash
# Build para producción
npm run build

# Los archivos estarán en dist/
```

## 🤝 Contribuir

1. Fork del proyecto
2. Crear branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

Construido con ❤️ usando [Astro](https://astro.build) + [React](https://reactjs.org)