# 🎤 Comedy Battle - Guía de Instalación y Deployment

Plataforma completa de Comedy Battle con votación en vivo, aplausómetro por micrófono y gestión de comediantes.

---

## 📦 Estructura del Proyecto

```
comedy-battle/
├── public/                 # Frontend (HTML, CSS, JS)
│   ├── index.html         # Página pública (registro y votación)
│   └── admin.html         # Panel de administración
├── scripts/               # Scripts utilitarios
│   └── init-db.js        # Inicializa la base de datos
├── server.js             # Backend API (Express)
├── package.json          # Dependencias del proyecto
├── database.json         # Base de datos (se crea automáticamente)
├── .env                  # Variables de entorno (crear desde .env.example)
├── .gitignore           # Archivos ignorados por Git
└── vercel.json          # Configuración para Vercel deployment
```

---

## 🚀 Instalación Local

### Requisitos Previos
- **Node.js** 14.0.0 o superior
- **npm** o **yarn**
- **Git**

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/comedy-battle.git
cd comedy-battle
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

```bash
cp .env.example .env
```

Editá `.env` si necesitás cambiar el puerto (por defecto 3000).

### Paso 4: Inicializar Base de Datos (Opcional)

```bash
npm run init-db
```

Esto crea `database.json` con datos de ejemplo. El servidor lo crea automáticamente si no existe.

### Paso 5: Iniciar el Servidor

**Modo desarrollo** (con auto-reload):
```bash
npm run dev
```

**Modo producción**:
```bash
npm start
```

### Paso 6: Abrir en el Navegador

- **Página pública:** http://localhost:3000
- **Panel admin:** http://localhost:3000/admin
- **API health check:** http://localhost:3000/api/health

---

## 🌐 Deployment en Vercel (Recomendado)

Vercel es la opción más fácil y **gratis** para este proyecto.

### Método 1: Deploy desde GitHub (Recomendado)

1. **Subí tu código a GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/comedy-battle.git
   git push -u origin main
   ```

2. **Conectá con Vercel:**
   - Andá a https://vercel.com
   - Clickeá "New Project"
   - Importá tu repositorio de GitHub
   - Vercel detecta automáticamente la configuración

3. **Configurá las variables de entorno en Vercel:**
   - En el dashboard de Vercel → Settings → Environment Variables
   - Agregá: `NODE_ENV=production`

4. **Deploy automático:**
   - Cada push a `main` se despliega automáticamente
   - Obtenés una URL: `https://tu-proyecto.vercel.app`

### Método 2: Deploy desde CLI

```bash
npm install -g vercel
vercel login
vercel
```

---

## 🐳 Deployment en Render

Alternativa gratuita a Vercel.

1. Andá a https://render.com
2. Clickeá "New +" → "Web Service"
3. Conectá tu repositorio de GitHub
4. Configuración:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Deploy!

---

## 📦 Deployment en Railway

Otra opción gratuita.

1. Andá a https://railway.app
2. Clickeá "New Project" → "Deploy from GitHub repo"
3. Seleccioná tu repositorio
4. Railway detecta Node.js automáticamente
5. Configurá el puerto si es necesario
6. Deploy!

---

## 🔧 API Endpoints

### Comediantes
- `GET /api/comedians` - Lista de comediantes
- `POST /api/comedians` - Crear comediante
- `PUT /api/comedians/:id` - Actualizar comediante
- `DELETE /api/comedians/:id` - Eliminar comediante

### Votación
- `POST /api/vote` - Registrar voto
- `POST /api/register` - Registrar asistente

### Aplausómetro
- `POST /api/maxdb` - Actualizar máximo de dB

### Estadísticas
- `GET /api/ranking` - Obtener ranking
- `GET /api/stats` - Obtener estadísticas
- `GET /api/data` - Obtener todos los datos

### Administración
- `POST /api/reset` - Reiniciar datos (mantiene comediantes)
- `GET /api/export` - Exportar datos en JSON

### Utilidades
- `GET /api/health` - Health check

---

## 📊 Base de Datos

### Formato de database.json

```json
{
  "comedians": [
    { "id": 1, "name": "Diego Comediante" }
  ],
  "nextId": 2,
  "registrados": [
    {
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "telefono": "+54 9 11 1234-5678",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ],
  "votos": { "1": 5 },
  "maxDB": { "1": 87 },
  "votes": { "session-id-123": 1 }
}
```

### Migrar a MongoDB (Opcional)

Si tu evento crece mucho, podés migrar a MongoDB:

1. Instalá mongoose: `npm install mongoose`
2. Reemplazá las funciones `readDB()` y `writeDB()` en `server.js`
3. Creá modelos para Comedian, Vote, Registration

---

## 🔐 Seguridad

### Producción Checklist

- [ ] Agregá autenticación al panel admin
- [ ] Configurá rate limiting (usa `express-rate-limit`)
- [ ] Usá HTTPS (Vercel lo hace automáticamente)
- [ ] Implementá CORS específico (no permitir todos los orígenes)
- [ ] Agregá validación de datos más estricta
- [ ] Implementá logs de auditoría

### Ejemplo: Agregar Autenticación Simple

```javascript
// En server.js
const basicAuth = require('express-basic-auth');

app.use('/admin', basicAuth({
    users: { 'admin': process.env.ADMIN_PASSWORD },
    challenge: true
}));
```

---

## 🎯 Configuración para Producción

### 1. Cambiar Datos Iniciales

Editá `scripts/init-db.js` con tus comediantes reales:

```javascript
comedians: [
    { id: 1, name: "Tu Comediante 1" },
    { id: 2, name: "Tu Comediante 2" }
]
```

### 2. Personalizar Estilos

Los archivos HTML en `public/` tienen los estilos inline. Podés:
- Cambiar colores neón (buscar `#ff00ff`, `#00ffff`, `#ffff00`)
- Modificar títulos y textos
- Agregar tu logo en el header

### 3. Configurar Dominio Personalizado

En Vercel:
1. Settings → Domains
2. Agregá tu dominio
3. Configurá DNS según las instrucciones

---

## 🧪 Testing

### Test Manual de Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# Obtener comediantes
curl http://localhost:3000/api/comedians

# Agregar comediante
curl -X POST http://localhost:3000/api/comedians \
  -H "Content-Type: application/json" \
  -d '{"name":"Nuevo Comediante"}'

# Votar
curl -X POST http://localhost:3000/api/vote \
  -H "Content-Type: application/json" \
  -d '{"comedianId":1,"sessionId":"test-session-123"}'

# Obtener ranking
curl http://localhost:3000/api/ranking
```

---

## 🐛 Troubleshooting

### El servidor no inicia
- Verificá que el puerto 3000 no esté en uso: `lsof -i :3000`
- Probá con otro puerto: `PORT=3001 npm start`

### La base de datos no se crea
- Ejecutá manualmente: `npm run init-db`
- Verificá permisos de escritura en la carpeta

### Los cambios no se reflejan
- Limpiá caché del navegador (Ctrl+Shift+R)
- Verificá que el backend esté corriendo
- Revisá la consola del navegador para errores

### CORS errors
- Asegurate que el frontend esté haciendo requests a la URL correcta
- En producción, configurá CORS para tu dominio específico

---

## 📝 Scripts Disponibles

```bash
npm start          # Inicia el servidor en modo producción
npm run dev        # Inicia el servidor en modo desarrollo (con nodemon)
npm run init-db    # Inicializa la base de datos con datos de ejemplo
```

---

## 🔄 Actualizaciones Futuras

### Mejoras Sugeridas

1. **Autenticación Real**
   - Implementar JWT o sesiones
   - Panel admin con login

2. **WebSockets**
   - Actualizaciones en tiempo real
   - Ver votos en vivo sin refrescar

3. **Base de Datos Robusta**
   - MongoDB o PostgreSQL
   - Backups automáticos

4. **Analytics**
   - Google Analytics
   - Dashboard de métricas

5. **PWA**
   - Service Worker
   - Funciona offline

6. **Multimedia**
   - Fotos de comediantes
   - Videos del evento

---

## 📞 Soporte

¿Problemas con el deployment?

1. Revisá la documentación de Vercel: https://vercel.com/docs
2. Chequeá los logs en el dashboard de tu plataforma
3. Verificá que todas las dependencias estén en `package.json`

---

## 📄 Licencia

MIT License - Usá libremente para tus eventos!

---

**¡Éxito con tu Comedy Battle! 🎤🔥**
