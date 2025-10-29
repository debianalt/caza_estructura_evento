# Configuración de GitHub Pages para Visualizaciones MCA

## ✅ Cambios Completados

He creado una página web interactiva con visualizaciones del Análisis de Correspondencias Múltiples (MCA) usando Plotly.js. Los cambios incluyen:

### Archivos Creados

1. **`docs/index.html`** - Página principal con estructura HTML5
2. **`docs/css/style.css`** - Estilos responsive y modernos
3. **`docs/js/main.js`** - Lógica de visualizaciones con Plotly.js
4. **`docs/data/mca_results.json`** - Resultados del análisis MCA
5. **`docs/data/cazadores_clustered.csv`** - Datos con clusters asignados
6. **`scripts/export_mca_to_json.py`** - Script Python para generar JSON
7. **`scripts/export_mca_to_json.R`** - Script R alternativo

### Visualizaciones Incluidas

1. 📊 **Scree Plot** - Valores propios y varianza explicada
2. 🗺️ **Mapa de Individuos** - Individuos coloreados por cluster (4 grupos)
3. 🏷️ **Mapa de Categorías** - Proyección de variables categóricas
4. 🔀 **Biplot** - Individuos y categorías juntos
5. 🎲 **Visualización 3D** - Espacio factorial interactivo
6. 📈 **Distribución de Clusters** - Tamaños de cada grupo

## 🚀 Pasos para Activar GitHub Pages

### Opción 1: Desde la Interfaz Web de GitHub

1. Ve a tu repositorio en GitHub: https://github.com/debianalt/caza_estructura_evento
2. Haz clic en **Settings** (⚙️ Configuración)
3. En el menú lateral, selecciona **Pages**
4. En **Source** (Origen):
   - Branch: Selecciona tu rama principal (`main` o `master`)
   - Folder: Selecciona `/docs`
5. Haz clic en **Save**
6. Espera 1-2 minutos para que GitHub compile el sitio
7. Tu sitio estará disponible en: **https://debianalt.github.io/caza_estructura_evento/**

### Opción 2: Usando GitHub CLI (si está instalado)

```bash
# Configurar GitHub Pages para usar la carpeta docs/
gh api repos/{owner}/{repo}/pages -X POST -f source[branch]=main -f source[path]=/docs
```

## 🔍 Verificación

Una vez activado GitHub Pages:

1. Visita la URL de tu sitio
2. Deberías ver:
   - Título: "Análisis de Correspondencias Múltiples"
   - 6 visualizaciones interactivas
   - Estadísticas resumidas (158 individuos, 24 categorías, 4 clusters)

## 📱 Características

- ✅ **Responsive**: Funciona en móviles, tablets y escritorio
- ✅ **Interactivo**: Zoom, pan, hover para ver detalles
- ✅ **Exportable**: Descarga gráficos como PNG
- ✅ **Moderno**: Diseño limpio con gradientes y sombras
- ✅ **Rápido**: Datos pre-procesados en JSON

## 🔄 Actualizar los Datos

Si actualizas los datos de cazadores, regenera las visualizaciones:

```bash
# Ejecutar el script Python
python3 scripts/export_mca_to_json.py

# Hacer commit y push
git add docs/data/
git commit -m "Update MCA visualization data"
git push
```

Las visualizaciones se actualizarán automáticamente en GitHub Pages (puede tardar 1-2 minutos).

## 🎨 Personalización

### Cambiar Colores de Clusters

Edita `docs/js/main.js`:

```javascript
const clusterColors = {
    1: '#3498db',  // Azul
    2: '#2ecc71',  // Verde
    3: '#e74c3c',  // Rojo
    4: '#f39c12'   // Naranja
};
```

### Modificar Estilos

Edita las variables CSS en `docs/css/style.css`:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    /* ... más variables ... */
}
```

## 📊 Resultados del Análisis

- **Individuos analizados**: 158 cazadores
- **Categorías de variables**: 24
- **Variables activas**: MOVILIDAD, MIEMBROS, DECOMISO, GENERO, RAMA, BENEFICIOS
- **Clusters identificados**: 4 grupos
  - Cluster 1: 47 individuos
  - Cluster 2: 61 individuos
  - Cluster 3: 45 individuos
  - Cluster 4: 5 individuos
- **Varianza explicada (Dim1+Dim2)**: 48.85%

## 🐛 Solución de Problemas

### El sitio no carga
- Verifica que GitHub Pages esté activado en Settings → Pages
- Espera 2-3 minutos después de hacer push
- Revisa que la rama y carpeta sean correctas

### Las visualizaciones no aparecen
- Abre la consola del navegador (F12)
- Verifica que `mca_results.json` se carga correctamente
- Asegúrate de que Plotly.js se carga desde el CDN

### Quiero usar mi propio dominio
- En Settings → Pages → Custom domain
- Ingresa tu dominio (ej: `mca.midominio.com`)
- Configura un CNAME en tu proveedor de DNS

## 📚 Tecnologías Utilizadas

- **Plotly.js 2.27.0**: Visualizaciones interactivas
- **Python prince**: Análisis MCA
- **scikit-learn**: Clustering jerárquico
- **HTML5/CSS3**: Estructura y estilos
- **GitHub Pages**: Hosting gratuito

## 📝 Notas Adicionales

- Los datos están pre-procesados y optimizados para carga rápida
- Las visualizaciones son 100% del lado del cliente (no requieren servidor)
- Compatible con todos los navegadores modernos
- El repositorio R original se mantiene intacto en `scripts/MCA.R`

---

**¿Necesitas ayuda?** Consulta el README en `docs/README.md` o revisa la documentación de [Plotly.js](https://plotly.com/javascript/).
