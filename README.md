# JCE Citizen Frontend

Sistema de consulta de cédulas dominicanas con funcionalidades de administración.

## Características

### Para Usuarios
- **Landing Page Profesional**: Información del servicio, testimonios y características
- **Sistema de Autenticación**: Registro e inicio de sesión seguro
- **Dashboard de Consultas**: Interface para consultar cédulas con historial
- **Sistema de Tokens**: Pago por consulta con integración a Buy Me a Coffee
- **Diseño Responsive**: Optimizado para todos los dispositivos

### Para Administradores
- **Backoffice Completo**: Panel de administración separado
- **Gestión de Contenido**: Configuración dinámica de la landing page
- **Sistema de Banners**: Promociones configurables
- **Templates de Email**: Diseños personalizables para notificaciones
- **Gestión de Usuarios**: Control de accesos y tokens
- **Analytics**: Métricas de uso y ventas

## Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React  
- **Routing**: React Router DOM
- **Estado**: Context API + Custom Hooks
- **HTTP Client**: Fetch API nativo
- **Backend**: Spring Boot (API separada)

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base (Button, Input, etc.)
│   ├── layout/         # Layout components (Header, Footer)
│   └── common/         # Componentes comunes (LoadingSpinner, etc.)
├── contexts/           # React Contexts
├── hooks/              # Custom React Hooks
├── pages/              # Páginas de la aplicación
│   ├── auth/          # Páginas de autenticación
│   └── admin/         # Páginas del backoffice
├── services/           # Servicios para comunicación con API
├── types/              # TypeScript type definitions
├── utils/              # Funciones de utilidad
└── App.tsx            # Componente principal
```

## Configuración

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con la URL del backend:
   ```
   VITE_API_URL=http://localhost:8080/api
   ```

3. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## API Integration

El frontend se comunica con un backend Spring Boot a través de los siguientes servicios:

### AuthService
- `POST /auth/login` - Login de usuario
- `POST /auth/register` - Registro de usuario
- `POST /auth/admin/login` - Login de administrador
- `POST /auth/refresh` - Renovar token
- `GET /auth/me` - Obtener usuario actual

### CedulaService
- `POST /cedula/query` - Consultar cédula
- `GET /cedula/history` - Historial de consultas
- `GET /cedula/query/:id` - Detalles de consulta

### PaymentService
- `POST /payments/create-order` - Crear orden de pago
- `POST /payments/verify/:orderId` - Verificar pago
- `GET /payments/history` - Historial de pagos
- `GET /payments/tokens` - Tokens del usuario

### AdminService
- `GET /admin/settings` - Configuraciones de la app
- `PUT /admin/settings` - Actualizar configuraciones
- `GET /admin/users` - Lista de usuarios
- `PUT /admin/banners` - Gestión de banners
- `PUT /admin/email-templates` - Templates de email

## Funcionalidades Principales

### 1. Sistema de Autenticación
- JWT tokens para autenticación
- Refresh tokens para sesiones persistentes
- Roles de usuario (USER, ADMIN)
- Rutas protegidas

### 2. Consulta de Cédulas
- Validación de formato dominicano (XXX-XXXXXXX-X)
- Sistema de tokens (1 token = 1 consulta)
- Historial de consultas por usuario
- Resultados detallados con información oficial

### 3. Sistema de Pagos
- Integración con Buy Me a Coffee
- Paquetes de tokens configurables
- Verificación automática de pagos
- Historial de transacciones

### 4. Panel Administrativo
- Configuración dinámica de contenido
- Gestión de usuarios y tokens
- Sistema de banners promocionales
- Templates de email personalizables
- Analytics y métricas

### 5. Diseño y UX
- Diseño responsive y moderno
- Animaciones y micro-interacciones
- Sistema de colores profesional
- Componentes reutilizables
- Accesibilidad optimizada

## Build y Deploy

```bash
# Build para producción
npm run build

# Preview de build
npm run preview

# Linting
npm run lint
```

## Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

Este proyecto es privado y confidencial.