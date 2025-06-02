# YuhuHero Frontend

Frontend para la aplicación de educación financiera gamificada YuhuHero, desarrollado con React, TypeScript y Tailwind CSS.

## Requisitos

- Node.js 14+
- npm o yarn

## Instalación

1. Instalar las dependencias:

```bash
npm install
# o
yarn install
```

2. Iniciar el servidor de desarrollo:

```bash
npm start
# o
yarn start
```

La aplicación estará disponible en http://localhost:3000

## Conexión con el Backend

Por defecto, la aplicación intenta conectarse a un backend en `http://localhost:5001/api`. Si el backend está en otra URL, puede configurarse en `src/services/api.ts`.

## Estructura del Proyecto

```
game_front/
├── public/           # Archivos estáticos
├── src/
│   ├── components/   # Componentes React
│   ├── services/     # Servicios de API
│   ├── store/        # Zustand stores
│   ├── App.tsx       # Componente principal
│   └── index.tsx     # Punto de entrada
├── package.json      # Dependencias
└── tailwind.config.js # Configuración de Tailwind CSS
```

## Características Principales

- **Autenticación**: Sistema de registro e inicio de sesión
- **Quiz Financiero**: Prueba de conceptos financieros con retroalimentación
- **Mapa de Progreso**: Visualización del progreso del usuario
- **Notificaciones**: Sistema de notificaciones en tiempo real
- **Panel de Administración**: Gestión de usuarios y contenido

## Páginas Principales

- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/home` - Página principal con mapa del juego
- `/quiz` - Quiz financiero
- `/admin` - Panel de administración

## Usuarios de Prueba

Para probar rápidamente la aplicación, puede utilizar las siguientes credenciales:

- **Usuario normal**:
  - Teléfono: 555-123-4567
  - Contraseña: password123

- **Administrador**:
  - Contraseña: admin123 (en la ruta /admin)

## Desarrollo

La aplicación está configurada con Create React App y utiliza:

- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **Zustand** para gestión de estado
- **Framer Motion** para animaciones
- **React Router** para enrutamiento
- **Axios** para peticiones HTTP 