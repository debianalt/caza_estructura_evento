# 🚀 Guía Rápida: Activar las Visualizaciones en GitHub Pages

## Paso 1: Crear Pull Request y Hacer Merge a Main

1. **Ve a tu repositorio en GitHub:**
   ```
   https://github.com/debianalt/caza_estructura_evento
   ```

2. **Haz clic en el banner amarillo** que dice:
   ```
   "claude/github-pages-visualizations-011CUbsnwXqLaWNaYpxHBR2a had recent pushes"
   ```

   O usa este enlace directo:
   ```
   https://github.com/debianalt/caza_estructura_evento/pull/new/claude/github-pages-visualizations-011CUbsnwXqLaWNaYpxHBR2a
   ```

3. **Crea el Pull Request:**
   - Título: `Add interactive MCA visualizations for GitHub Pages`
   - Click en **"Create pull request"**

4. **Hacer Merge:**
   - Haz clic en **"Merge pull request"**
   - Confirma con **"Confirm merge"**
   - ✅ Los archivos ahora estarán en la rama `main`

## Paso 2: Configurar GitHub Pages

1. **Ve a Settings:**
   ```
   GitHub repo → Settings → Pages (en el menú lateral izquierdo)
   ```

2. **Configura la fuente:**
   - **Branch**: Selecciona `main`
   - **Folder**: Selecciona `/docs`
   - Haz clic en **Save**

3. **Espera 1-2 minutos** para que GitHub compile el sitio

4. **Verifica que funcione:**
   - Refresca la página de Settings → Pages
   - Deberías ver un mensaje verde: **"Your site is live at..."**
   - Visita: `https://debianalt.github.io/caza_estructura_evento/`

## ✅ Checklist de Verificación

- [ ] Pull Request creado
- [ ] Pull Request merged a `main`
- [ ] GitHub Pages configurado para usar `main` branch y `/docs` folder
- [ ] Sitio accesible en `https://debianalt.github.io/caza_estructura_evento/`

## 🎯 Lo Que Deberías Ver

Una vez activo, tu sitio mostrará:

- ✨ **Título**: "Análisis de Correspondencias Múltiples"
- 📊 **6 visualizaciones interactivas** con Plotly.js
- 📈 **Estadísticas**: 158 individuos, 24 categorías, 4 clusters
- 🎨 **Diseño moderno** responsive

## 🐛 Si Algo No Funciona

### El sitio muestra 404
- Verifica que hiciste merge a `main` (no a otra rama)
- Asegúrate de seleccionar `/docs` como folder en Settings → Pages

### Las visualizaciones no cargan
- Abre la consola del navegador (F12)
- Busca errores de carga de `mca_results.json`
- Verifica que los archivos estén en `docs/data/` en la rama `main`

### El sitio no se actualiza
- GitHub Pages puede tardar 1-5 minutos en compilar
- Haz "hard refresh" en tu navegador: Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac)

## 📞 Ayuda Adicional

Si necesitas ayuda:
1. Verifica el status en: `Settings → Pages`
2. Mira los logs de compilación (si hay errores, GitHub los mostrará)
3. Consulta: https://docs.github.com/en/pages/getting-started-with-github-pages

---

**Tiempo estimado**: 5 minutos ⏱️
