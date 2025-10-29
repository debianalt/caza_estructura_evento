# Visualizaciones Interactivas del Análisis MCA

Este directorio contiene las visualizaciones interactivas del Análisis de Correspondencias Múltiples (MCA) sobre la estructura del evento de caza en Misiones, Argentina.

## Estructura

```
docs/
├── index.html          # Página principal con visualizaciones
├── css/
│   └── style.css      # Estilos personalizados
├── js/
│   └── main.js        # Lógica de visualizaciones con Plotly.js
└── data/
    ├── mca_results.json          # Resultados del análisis MCA
    └── cazadores_clustered.csv   # Datos originales con clusters
```

## Visualizaciones Incluidas

1. **Scree Plot**: Valores propios y varianza explicada por cada dimensión
2. **Mapa Factorial de Individuos**: Proyección de individuos coloreados por cluster
3. **Mapa Factorial de Categorías**: Proyección de las categorías de variables
4. **Biplot**: Visualización combinada de individuos y categorías
5. **Visualización 3D**: Espacio tridimensional interactivo
6. **Distribución de Clusters**: Gráfico de barras con tamaños de clusters

## Tecnologías Utilizadas

- **HTML5/CSS3**: Estructura y estilos responsive
- **Plotly.js**: Biblioteca de visualizaciones interactivas
- **Python (prince)**: Análisis MCA y clustering jerárquico

## Actualizar los Datos

Para regenerar las visualizaciones con datos actualizados:

1. Asegúrate de tener los datos en `data/raw/Cazadores.csv`
2. Ejecuta el script Python:
   ```bash
   python3 scripts/export_mca_to_json.py
   ```
3. Los archivos JSON se actualizarán automáticamente en `docs/data/`

## Configuración de GitHub Pages

Para publicar estas visualizaciones en GitHub Pages:

1. Ve a **Settings** → **Pages** en tu repositorio
2. En **Source**, selecciona la rama principal (main/master)
3. En **Folder**, selecciona `/docs`
4. Haz clic en **Save**
5. Tu sitio estará disponible en: `https://[usuario].github.io/[repositorio]/`

## Personalización

### Colores de Clusters

Puedes modificar los colores en `js/main.js`:

```javascript
const clusterColors = {
    1: '#3498db',  // Azul
    2: '#2ecc71',  // Verde
    3: '#e74c3c',  // Rojo
    4: '#f39c12'   // Naranja
};
```

### Estilos

Modifica las variables CSS en `css/style.css`:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    /* ... más variables ... */
}
```

## Licencia

Este proyecto está bajo la misma licencia que el repositorio principal.
