# YuhuHero - Aplicación de Educación Financiera Gamificada

YuhuHero es una aplicación educativa que busca enseñar conceptos financieros a través de la gamificación, ofreciendo una experiencia interactiva y divertida para los usuarios.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

```
yuhuhero/
├── game_front/        # Frontend en React
└── game_back/         # Backend en FastAPI
```

## Tecnologías Utilizadas

### Frontend
- **React 18**: Biblioteca de UI
- **TypeScript**: Lenguaje de programación tipado
- **Tailwind CSS**: Framework CSS utilitario
- **Zustand**: Gestión de estado
- **React Router**: Navegación
- **Framer Motion**: Animaciones
- **Axios**: Cliente HTTP
- **React Toastify**: Notificaciones
- **React Confetti**: Efectos visuales

### Backend
- **FastAPI**: Framework web para Python
- **MongoDB**: Base de datos NoSQL
- **PyJWT**: Autenticación con tokens JWT
- **Pydantic**: Validación de datos
- **Motor**: Driver asíncrono para MongoDB
- **Bcrypt**: Encriptación de contraseñas

## Arquitectura

### Frontend (game_front)

```
game_front/
├── public/           # Archivos estáticos
├── src/
│   ├── components/   # Componentes React
│   │   ├── AdminAccessPage.tsx    # Página de acceso administrativo
│   │   ├── AdminPanel.tsx         # Panel de administración
│   │   ├── BottomNav.tsx          # Navegación inferior
│   │   ├── DebugPanel.tsx         # Panel de depuración
│   │   ├── FinancialQuiz.tsx      # Componente del quiz financiero
│   │   ├── GameMap.tsx            # Mapa del juego
│   │   ├── GameTile.tsx           # Casilla del mapa
│   │   ├── HomePage.tsx           # Página principal
│   │   ├── InAppNotification.tsx  # Notificación en la aplicación
│   │   ├── Login.tsx              # Página de inicio de sesión
│   │   ├── NotificationContainer.tsx # Contenedor de notificaciones
│   │   ├── NotificationManager.tsx   # Gestor de notificaciones
│   │   ├── PrivateRoute.tsx       # Ruta protegida
│   │   ├── ProtectedAdminRoute.tsx # Ruta protegida para admin
│   │   └── Register.tsx           # Página de registro
│   ├── services/     # Servicios de API
│   │   └── api.ts    # Cliente HTTP y endpoints
│   ├── store/        # Gestión de estado
│   │   ├── useGameStore.ts      # Estado del juego
│   │   └── notificationStore.ts # Estado de notificaciones
│   ├── App.tsx       # Componente principal
│   ├── App.css       # Estilos globales
│   ├── index.tsx     # Punto de entrada
│   └── index.css     # Estilos de tailwind
├── package.json      # Dependencias
├── tsconfig.json     # Configuración TypeScript
└── tailwind.config.js # Configuración Tailwind CSS
```

### Backend (game_back)

```
game_back/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.py          # Endpoints de autenticación
│   │   │   ├── game.py          # Endpoints del juego
│   │   │   ├── notifications.py # Endpoints de notificaciones
│   │   │   ├── quiz.py          # Endpoints del quiz
│   │   │   └── users.py         # Endpoints de usuarios
│   │   └── dependencies.py      # Dependencias de FastAPI
│   ├── core/
│   │   ├── config.py            # Configuración
│   │   └── security.py          # Seguridad y JWT
│   ├── db/
│   │   ├── database.py          # Conexión a MongoDB
│   │   └── repositories/        # Acceso a datos
│   ├── models/
│   │   ├── game.py              # Modelos del juego
│   │   ├── notification.py      # Modelos de notificaciones
│   │   ├── quiz.py              # Modelos del quiz
│   │   └── user.py              # Modelos de usuario
│   └── main.py                  # Punto de entrada
├── requirements.txt             # Dependencias Python
└── .env                         # Variables de entorno
```

## Flujo de Datos

1. **Autenticación**:
   - El usuario se registra o inicia sesión
   - El backend valida las credenciales y genera un token JWT
   - El frontend almacena el token en localStorage
   - Las peticiones posteriores incluyen el token en el header

2. **Flujo de Quiz**:
   - El usuario accede al quiz financiero
   - El frontend solicita las preguntas al backend
   - El usuario responde las preguntas
   - Las respuestas se envían al backend para evaluación
   - El backend calcula el resultado y otorga recompensas
   - El frontend muestra los resultados y actualiza el progreso

3. **Progreso del Juego**:
   - El estado del juego se gestiona con Zustand
   - Los cambios en el progreso se sincronizan con el backend
   - El mapa del juego muestra el progreso actual del usuario

4. **Notificaciones**:
   - El backend genera notificaciones para eventos importantes
   - El frontend consulta periódicamente las notificaciones
   - Las notificaciones no leídas se muestran al usuario

## Características Principales

### Autenticación y Seguridad
- Registro con nombre, teléfono y contraseña
- Inicio de sesión seguro
- Protección de rutas para usuarios autenticados
- Panel de administración con autenticación separada

### Educación Financiera
- Quiz interactivo con preguntas sobre finanzas
- Retroalimentación inmediata sobre respuestas
- Explicaciones de conceptos financieros

### Gamificación
- Mapa de progreso visual
- Sistema de recompensas (monedas)
- Niveles y misiones
- Celebraciones visuales al completar objetivos

### Interfaz de Usuario
- Diseño responsivo para móviles y escritorio
- Animaciones fluidas con Framer Motion
- Notificaciones en tiempo real
- Navegación intuitiva

### Administración
- Panel de control para administradores
- Gestión de usuarios
- Estadísticas de uso
- Gestión de contenido educativo

## Configuración y Ejecución

### Requisitos Previos
- Node.js 14+
- Python 3.7+
- MongoDB

### Frontend
```bash
# Navegar al directorio del frontend
cd game_front

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

### Backend
```bash
# Navegar al directorio del backend
cd game_back

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
uvicorn app.main:app --reload --port 5001
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Usuarios
- `GET /api/users/me` - Obtener perfil del usuario
- `PUT /api/users/me/quiz-status` - Actualizar estado del quiz

### Quiz
- `GET /api/quiz/financial` - Obtener preguntas del quiz
- `POST /api/quiz/submit` - Enviar respuestas

### Juego
- `GET /api/game/progress` - Obtener progreso del juego
- `PUT /api/game/progress` - Actualizar progreso
- `GET /api/game/map` - Obtener mapa del juego

### Notificaciones
- `GET /api/notifications` - Obtener notificaciones
- `PUT /api/notifications/{id}` - Marcar notificación como leída

## Usuarios de Prueba

Para probar rápidamente la aplicación, puede utilizar las siguientes credenciales:

- **Usuario normal**:
  - Teléfono: 555-123-4567
  - Contraseña: password123

- **Administrador**:
  - Contraseña: admin123 (en la ruta /admin) 