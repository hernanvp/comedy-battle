# 🚀 Deploy Simple en Vercel (Sin Base de Datos)

## ✅ Versión Actual: In-Memory Storage

Tu proyecto ahora usa **almacenamiento en memoria**, perfecto para:
- ✅ Eventos cortos (1-3 horas)
- ✅ Demos y pruebas
- ✅ No requiere configuración de base de datos
- ✅ Deploy en 1 minuto

**Nota:** Los datos se mantienen mientras el serverless esté activo (suficiente para un evento)

## 🚀 Deploy en 3 Pasos

### 1️⃣ Push a GitHub

```bash
git add .
git commit -m "Ready for Vercel deploy"
git push origin main
```

### 2️⃣ Deploy en Vercel

**Opción A - Dashboard (recomendada):**
1. Ve a https://vercel.com/new
2. Importa tu repositorio de GitHub
3. Clic en **Deploy**
4. ¡Listo! 🎉

**Opción B - CLI:**
```bash
npm install -g vercel
vercel --prod
```

### 3️⃣ Verificar

Visita tu URL de Vercel:

```
https://tu-proyecto.vercel.app/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "storage": "in-memory",
  "comedians": 4,
  "votes": 0
}
```

## 📱 URLs de tu App

Una vez deployado:

```
🌐 Página Pública:
https://tu-proyecto.vercel.app/index.html

👨‍💼 Panel Admin:
https://tu-proyecto.vercel.app/admin.html

📊 API Health:
https://tu-proyecto.vercel.app/api/health

🎭 Lista de Comediantes:
https://tu-proyecto.vercel.app/api/comedians
```

## ⚠️ Limitaciones del Storage In-Memory

**Cuándo se pierden los datos:**
- ❌ Cada vez que haces un nuevo deploy
- ❌ Cuando el serverless se "enfría" (después de ~15 min sin uso)
- ❌ Si Vercel reinicia el contenedor

**Solución:**
Para eventos en vivo esto es **suficiente**, ya que:
- ✅ Durante el evento (1-3 horas) los datos persisten
- ✅ Puedes exportar los datos al final con `/api/export`
- ✅ Es gratis y sin configuración

## 💾 Exportar Datos del Evento

**Antes de terminar el evento:**

1. Ve al panel admin
2. Clic en **"Exportar Datos"**
3. Se descarga un JSON con:
   - Todos los registrados
   - Todos los votos
   - Máximos de aplausos
   - Ranking final

O usa directamente:
```
https://tu-proyecto.vercel.app/api/export
```

## 🔧 Si Necesitas Persistencia Real

Si necesitas que los datos persistan entre eventos, tienes 3 opciones:

### Opción 1: Supabase (Gratis, Recomendada)

1. Crea cuenta en https://supabase.com
2. Crea proyecto nuevo
3. Copia la URL y Key
4. Agrega en Vercel → Settings → Environment Variables:
   ```
   SUPABASE_URL=tu-url
   SUPABASE_KEY=tu-key
   ```

Avísame y te genero el código para Supabase.

### Opción 2: Neon (Gratis, Postgres)

1. Crea cuenta en https://neon.tech
2. Crea base de datos
3. Copia connection string
4. Agrega en Vercel → Settings → Environment Variables:
   ```
   DATABASE_URL=postgresql://...
   ```

Avísame y te genero el código para Neon.

### Opción 3: Railway (Gratis primeros $5)

1. Crea cuenta en https://railway.app
2. Crea proyecto Postgres
3. Copia connection string
4. Similar al proceso anterior

## 🎯 Recomendación

**Para eventos en vivo:**
- ✅ Usa la versión actual (in-memory)
- ✅ Exporta los datos al final del evento
- ✅ Es gratis y funciona perfecto

**Para múltiples eventos recurrentes:**
- ✅ Usa Supabase (gratis hasta 500MB)
- ✅ Los datos persisten entre eventos
- ✅ Puedes ver histórico

## 📊 ¿Tu caso de uso?

Cuéntame:
1. **¿Es para un evento único o eventos recurrentes?**
2. **¿Necesitas ver datos de eventos pasados?**
3. **¿Cuántas personas esperás que participen?**

Y te optimizo la solución 🚀

---

## 🆘 Problemas Comunes

### Error: "Application Error"

**Solución:**
1. Ve a Vercel → Tu proyecto → Deployments
2. Clic en el deployment actual
3. Ve a **Functions** → Logs
4. Comparte el error y te ayudo

### Los HTML no cargan

**Solución:**
Asegúrate que `index.html` y `admin.html` estén en la carpeta `public/`

### API no responde

**Solución:**
Verifica que `api/index.js` exista y tenga `module.exports = app;` al final

---

**¿Todo listo para deployar?** Solo push a GitHub y deploy en Vercel 🚀
