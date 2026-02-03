# 🚀 Instrucciones para Subir a Git

Esta carpeta contiene **SOLO** los archivos necesarios para Git y Vercel.

## 📁 Estructura de Archivos

```
subir-a-git/
├── .gitignore                 ✅ Archivos a ignorar
├── package.json               ✅ Dependencias
├── vercel.json                ✅ Config de Vercel
├── README.md                  📖 Documentación principal
├── DEPLOY-SIMPLE.md           📖 Guía de deploy
├── EXPORTAR-PDF.md            📖 Guía de exportación
│
├── api/
│   └── index.js               🔧 Backend API
│
└── public/
    ├── index.html             🌐 Página pública
    ├── admin.html             🔒 Panel admin
    └── resultados.html        📄 Reporte PDF
```

## 🎯 Pasos para Subir a Git

### 1️⃣ En tu Terminal Local:

```bash
# 1. Crear nuevo repositorio (si aún no existe)
mkdir comedy-battle
cd comedy-battle

# 2. Copiar TODO el contenido de esta carpeta "subir-a-git"
# (arrastrá y soltá todo el contenido dentro de comedy-battle)

# 3. Inicializar Git
git init

# 4. Agregar todos los archivos
git add .

# 5. Primer commit
git commit -m "Initial commit - Comedy Battle Platform"

# 6. Conectar con GitHub
git branch -M main
git remote add origin https://github.com/TU-USUARIO/comedy-battle.git

# 7. Push!
git push -u origin main
```

### 2️⃣ Deploy en Vercel:

```
1. Ve a https://vercel.com
2. Login con GitHub
3. New Project → Import "comedy-battle"
4. Deploy (sin cambiar nada)
5. ¡Listo! 🎉
```

## ✅ Verificación

Los archivos en esta carpeta son:

- **Críticos**: `.gitignore`, `package.json`, `vercel.json`, `api/index.js`, `public/*.html`
- **Documentación**: `README.md`, `DEPLOY-SIMPLE.md`, `EXPORTAR-PDF.md`

**Total: 10 archivos esenciales**

## 🔄 Si Ya Tenés un Repo con Archivos Viejos

```bash
# Opción 1: Reemplazar todo
cd comedy-battle
rm -rf *  # Borra todo
# Luego copiá el contenido de "subir-a-git"
git add -A
git commit -m "Clean structure for Vercel"
git push origin main --force

# Opción 2: Crear nuevo repositorio
# Seguí los pasos de la sección 1️⃣
```

## 📊 URLs Finales

Después del deploy, tu app estará en:

```
https://tu-proyecto.vercel.app/index.html      ← Público
https://tu-proyecto.vercel.app/admin.html      ← Admin
https://tu-proyecto.vercel.app/resultados.html ← PDF
https://tu-proyecto.vercel.app/api/health      ← Health
```

---

**¿Dudas?** Revisá `DEPLOY-SIMPLE.md` 📘
