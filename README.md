# 🎤 Comedy Battle - Plataforma de Votación Interactiva

Plataforma web completa para eventos de comedia con votación en vivo, registro de asistentes y aplausómetro con detección por micrófono.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green)
![License](https://img.shields.io/badge/license-MIT-orange)

---

## ✨ Características

### Para el Público
- 📝 **Registro de Asistentes** - Captura nombre, email y teléfono
- 🗳️ **Votación por Comediante** - Un voto por persona con validación
- 🎉 **Efectos Visuales** - Confetti y animaciones neón

### Para Organizadores
- 🎤 **Aplausómetro con Micrófono** - Detecta aplausos reales usando Web Audio API
- 📊 **Ranking en Tiempo Real** - Fórmula: (Votos × 10) + Máximo dB
- ⚙️ **Gestión de Comediantes** - CRUD completo (agregar, editar, borrar)
- 📈 **Estadísticas del Evento** - Dashboard con métricas en vivo
- 💾 **Exportación de Datos** - Descargá todos los resultados en JSON

---



## 📁 Estructura del Proyecto

```
comedy-battle/
├── public/
│   ├── index.html          # Página pública (registro + votación)
│   └── admin.html          # Panel admin (aplausómetro + ranking + config)
├── server.js               # Backend API con Express
├── database.json           # Base de datos (auto-generada)
├── package.json
└── README-DEPLOYMENT.md    # Guía completa de deployment
```

---

## 🎯 Cómo Usar en tu Evento


### Durante el Evento
1. **Público:** Escanea QR → Se registra → Vota por su favorito
2. **Vos (Admin):**
   - Seleccionás el comediante en escenario
   - Activás el micrófono 🎤
   - El sistema detecta automáticamente los aplausos
   - Guardá el máximo de dB alcanzado

### Al Final
1. Andá a **Ranking** para ver al ganador 👑
2. Exportá los datos en **Estadísticas** → "💾 Exportar Datos"

---

## 📊 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/comedians` | Lista de comediantes |
| POST | `/api/comedians` | Agregar comediante |
| PUT | `/api/comedians/:id` | Editar comediante |
| DELETE | `/api/comedians/:id` | Eliminar comediante |
| POST | `/api/vote` | Registrar voto |
| POST | `/api/register` | Registrar asistente |
| POST | `/api/maxdb` | Actualizar máximo dB |
| GET | `/api/ranking` | Obtener ranking |
| GET | `/api/stats` | Estadísticas del evento |
| POST | `/api/reset` | Reiniciar votación |
| GET | `/api/export` | Exportar datos |

---

## 🌐 Deployment

### Vercel (Recomendado - Gratis)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel
```

O conectá directamente desde GitHub en https://vercel.com

### Otras Opciones
- **Render:** https://render.com (gratis)
- **Railway:** https://railway.app (gratis con límites)
- **Heroku:** https://heroku.com (gratis con dynos)

Ver **[README-DEPLOYMENT.md](README-DEPLOYMENT.md)** para guía completa.

---

## 🎨 Personalización

### Cambiar Colores Neón
Buscá y reemplazá en `public/*.html`:
- `#ff00ff` - Magenta
- `#00ffff` - Cyan
- `#ffff00` - Amarillo

### Cambiar Comediantes por Defecto
Editá `scripts/init-db.js`:
```javascript
comedians: [
    { id: 1, name: "Tu Comediante 1" },
    { id: 2, name: "Tu Comediante 2" }
]
```

---

## 🔧 Tecnologías Utilizadas

**Backend:**
- Node.js + Express
- File-based JSON database (migrable a MongoDB/PostgreSQL)

**Frontend:**
- Vanilla JavaScript (sin frameworks)
- Web Audio API (para aplausómetro)
- Canvas Confetti
- CSS Animations

**Deployment:**
- Compatible con Vercel, Render, Railway, Heroku

---

## 📱 Compatibilidad

- ✅ Chrome, Edge, Firefox, Safari (iOS 14.3+)
- ✅ Android Chrome
- ✅ Responsive design (mobile-first)
- ⚠️ El micrófono requiere **HTTPS** en producción

---

## 🐛 Troubleshooting

**¿El micrófono no funciona?**
- Asegurate de dar permisos en el navegador
- En producción, necesitás HTTPS
- Probá en Chrome o Edge (mejor soporte)

**¿No se sincronizan los datos?**
- Verificá que el backend esté corriendo
- Revisá la consola del navegador para errores de conexión

**¿Los votos desaparecieron?**
- La base de datos está en `database.json`
- Hacé backups regulares con "Exportar Datos"

---

## 📝 Scripts NPM

```bash
npm start          # Inicia servidor (producción)
npm run dev        # Inicia servidor (desarrollo con auto-reload)
npm run init-db    # Inicializa base de datos
```

---

## 🎯 Fórmula del Ranking

```
Puntaje Final = (Votos × 10) + Volumen Máximo (dB %)
```

**Ejemplo:**
- Diego: 15 votos + 87 dB = **237 puntos**
- María: 12 votos + 95 dB = **215 puntos**

Los votos tienen más peso, pero un aplauso épico puede cambiar el resultado.

---

## 🚀 Roadmap de Mejoras

- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Autenticación JWT para panel admin
- [ ] Base de datos MongoDB/PostgreSQL
- [ ] Fotos de comediantes
- [ ] Sistema de rondas (clasificatoria, semifinal, final)
- [ ] PWA (Progressive Web App)
- [ ] Analytics y métricas avanzadas

---

## 🤝 Contribuir

1. Fork el proyecto
2. Creá tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abrí un Pull Request

---

## 📄 Licencia

MIT License - Usá libremente para tus eventos!

---

## 🎤 Créditos

Desarrollado con ❤️ para la comunidad de stand-up comedy.

¿Usaste esta plataforma en tu evento? ¡Contanos cómo te fue!

---

**[Ver Guía Completa de Deployment →](README-DEPLOYMENT.md)**
