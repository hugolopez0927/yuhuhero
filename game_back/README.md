# YuhuHero Backend API

Backend para la aplicación de educación financiera gamificada YuhuHero.

## Requisitos

- Python 3.8+
- MongoDB

## Configuración

1. Instalar las dependencias:

```bash
pip install -r requirements.txt
```

2. Crear un archivo `.env` basado en `.env.example` con tus propias configuraciones:

```
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=yuhuhero_db
SECRET_KEY=tu_clave_secreta_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

## Ejecución

Para iniciar el servidor:

```bash
uvicorn main:app --reload --port 5001
```

El servidor estará disponible en http://localhost:5001

## Documentación de la API

Una vez que el servidor esté en funcionamiento, puedes acceder a la documentación interactiva de la API en:

- Swagger UI: http://localhost:5001/docs
- ReDoc: http://localhost:5001/redoc

## Estructura del Proyecto

```
game_back/
├── app/
│   ├── config/         # Configuración (DB, seguridad)
│   ├── models/         # Modelos Pydantic
│   ├── routes/         # Rutas API
│   └── dependencies.py # Dependencias FastAPI
├── main.py             # Punto de entrada
├── requirements.txt    # Dependencias
└── .env                # Variables de entorno (no incluido en el repo)
```

## Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Usuarios
- `GET /api/users/me` - Obtener perfil del usuario actual
- `PUT /api/users/me/quiz-status` - Actualizar estado del quiz

### Quiz
- `GET /api/quiz/financial` - Obtener quiz financiero
- `POST /api/quiz/submit` - Enviar respuestas y obtener resultados

### Juego
- `GET /api/game/progress` - Obtener progreso del juego
- `PUT /api/game/progress` - Actualizar progreso del juego
- `GET /api/game/map` - Obtener mapa del juego

### Notificaciones
- `GET /api/notifications` - Obtener notificaciones del usuario
- `POST /api/notifications` - Crear nueva notificación
- `PUT /api/notifications/{id}` - Marcar notificación como leída 