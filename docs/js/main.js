// Main JavaScript para visualizaciones MCA

// Configuración de colores académicos/científicos
const academicBlue = '#D8D8D8';

// Configuración de colores por cluster
const clusterColors = {
    1: '#3498db',
    2: '#2ecc71',
    3: '#e74c3c',
    4: '#f39c12'
};

// Configuración general de Plotly
const plotlyConfig = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    toImageButtonOptions: {
        format: 'png',
        filename: 'mca_plot',
        height: 1200,
        width: 1600,
        scale: 2
    }
};

// Layout base para gráficos - Tema oscuro
const baseLayout = {
    font: {
        family: '"IBM Plex Mono", "Courier New", monospace',
        size: 12,
        color: '#e0e0e0'
    },
    paper_bgcolor: '#151b23',
    plot_bgcolor: '#0a0e14',
    hovermode: 'closest',
    margin: { l: 80, r: 80, t: 80, b: 80 }
};

// Cargar datos y crear visualizaciones
async function loadData() {
    try {
        const response = await fetch('data/mca_results.json');
        const data = await response.json();

        // Mostrar estadísticas resumidas
        displaySummaryStats(data);

        // Crear visualizaciones
        createScreePlot(data.eigenvalues);
        createIndividualsMap(data.individuals);
        createCategoriesMap(data.categories);
        createBiplot(data.individuals, data.categories);
        create3DPlot(data.individuals);
        createClusterDistribution(data.clusters);

        console.log('Visualizaciones MCA cargadas exitosamente');

        // Cargar y crear mapa geográfico
        const geoResponse = await fetch('data/geo_misiones.json');
        const geoData = await geoResponse.json();
        createMisionesMap(geoData);
        console.log('Mapa geográfico cargado exitosamente');

    } catch (error) {
        console.error('Error al cargar datos:', error);
        alert('Error al cargar los datos. Por favor, verifica los archivos JSON.');
    }
}

// Mostrar estadísticas resumidas
function displaySummaryStats(data) {
    const summaryDiv = document.getElementById('summary-stats');
    const stats = [
        { label: 'Individuos', value: data.individuals.id.length },
        { label: 'Categorías', value: data.categories.category.length },
        { label: 'Clusters', value: data.metadata.n_clusters },
        { label: 'Var. Explicada (Dim1+2)', value: `${data.eigenvalues.cumulative_percent[1].toFixed(1)}%` }
    ];

    summaryDiv.innerHTML = stats.map(stat => `
        <div class="stat-item">
            <span class="stat-value">${stat.value}</span>
            <span class="stat-label">${stat.label}</span>
        </div>
    `).join('');
}

// 1. Scree Plot (Gráfico de valores propios)
function createScreePlot(eigenvalues) {
    const trace1 = {
        x: eigenvalues.dim,
        y: eigenvalues.variance_percent,
        type: 'bar',
        name: 'Varianza %',
        marker: { color: '#3498db' },
        text: eigenvalues.variance_percent.map(v => v.toFixed(2) + '%'),
        textposition: 'outside'
    };

    const trace2 = {
        x: eigenvalues.dim,
        y: eigenvalues.cumulative_percent,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Varianza Acumulada %',
        yaxis: 'y2',
        line: { color: '#e74c3c', width: 3 },
        marker: { size: 8 }
    };

    const layout = {
        ...baseLayout,
        title: {
            text: 'Valores Propios y Varianza Explicada',
            font: { color: '#e0e0e0' }
        },
        xaxis: {
            title: 'Dimensión',
            dtick: 1,
            color: '#e0e0e0',
            gridcolor: '#2a3442'
        },
        yaxis: {
            title: 'Varianza Explicada (%)',
            side: 'left',
            color: '#e0e0e0',
            gridcolor: '#2a3442'
        },
        yaxis2: {
            title: 'Varianza Acumulada (%)',
            overlaying: 'y',
            side: 'right',
            range: [0, 100],
            color: '#e0e0e0',
            gridcolor: '#2a3442'
        },
        showlegend: true,
        legend: {
            x: 0.7,
            y: 1,
            bgcolor: 'rgba(21, 27, 35, 0.8)',
            bordercolor: '#2a3442',
            font: { color: '#e0e0e0' }
        }
    };

    Plotly.newPlot('scree-plot', [trace1, trace2], layout, plotlyConfig);
}

// 2. Mapa factorial de individuos
function createIndividualsMap(individuals) {
    const clusters = [...new Set(individuals.cluster)].sort();

    const traces = clusters.map(cluster => {
        const indices = individuals.cluster.map((c, i) => c === cluster ? i : -1).filter(i => i !== -1);
        return {
            x: indices.map(i => individuals.dim1[i]),
            y: indices.map(i => individuals.dim2[i]),
            mode: 'markers',
            type: 'scatter',
            name: `Cluster ${cluster}`,
            marker: {
                color: clusterColors[cluster],
                size: 8,
                line: { color: '#0a0e14', width: 1 }
            },
            text: indices.map(i => `Individuo ${i + 1}<br>Cluster ${cluster}`),
            hovertemplate: '%{text}<br>Dim1: %{x:.3f}<br>Dim2: %{y:.3f}<extra></extra>'
        };
    });

    const layout = {
        ...baseLayout,
        title: {
            text: 'Mapa Factorial de Individuos por Cluster',
            font: { color: '#e0e0e0' }
        },
        xaxis: {
            title: 'Dimensión 1',
            zeroline: true,
            zerolinewidth: 2,
            zerolinecolor: academicBlue,
            color: '#e0e0e0',
            gridcolor: '#2a3442'
        },
        yaxis: {
            title: 'Dimensión 2',
            zeroline: true,
            zerolinewidth: 2,
            zerolinecolor: academicBlue,
            color: '#e0e0e0',
            gridcolor: '#2a3442'
        },
        showlegend: true,
        legend: {
            x: 1.02,
            y: 1,
            bgcolor: 'rgba(21, 27, 35, 0.8)',
            bordercolor: '#2a3442',
            font: { color: '#e0e0e0' }
        }
    };

    Plotly.newPlot('individuals-map', traces, layout, plotlyConfig);
}

// 3. Mapa factorial de categorías
function createCategoriesMap(categories) {
    console.log('createCategoriesMap llamada con:', categories);

    // Verificar que existen los datos
    if (!categories || !categories.category || !categories.dim1 || !categories.dim2) {
        console.error('Datos de categorías incompletos:', categories);
        return;
    }

    // Filtrar categorías que NO contienen "Missing"
    const validIndices = [];
    const cleanNames = [];
    const filteredDim1 = [];
    const filteredDim2 = [];

    categories.category.forEach((cat, i) => {
        // Excluir si contiene "Missing" (case insensitive)
        if (!cat.toLowerCase().includes('missing')) {
            validIndices.push(i);
            const parts = cat.split('__');
            cleanNames.push(parts.length > 1 ? parts[1] : cat);
            filteredDim1.push(categories.dim1[i]);
            filteredDim2.push(categories.dim2[i]);
        }
    });

    console.log('Categorías filtradas (sin Missing):', cleanNames.length, 'de', categories.category.length);

    // Variar posiciones de texto para evitar superposiciones
    const textPositions = [];
    const positions = ['top center', 'bottom center', 'middle right', 'middle left', 'top right', 'top left', 'bottom right', 'bottom left'];
    for (let i = 0; i < cleanNames.length; i++) {
        textPositions.push(positions[i % positions.length]);
    }

    const trace = {
        x: filteredDim1,
        y: filteredDim2,
        mode: 'markers+text',
        type: 'scatter',
        marker: {
            color: '#9b59b6',
            size: 14,
            line: { color: academicBlue, width: 2 }
        },
        text: cleanNames,
        textposition: textPositions,
        textfont: {
            size: 8,
            color: academicBlue,
            family: '"IBM Plex Mono", "Courier New", monospace'
        },
        hovertemplate: '<b>%{text}</b><br>Dim1: %{x:.3f}<br>Dim2: %{y:.3f}<extra></extra>'
    };

    const layout = {
        font: baseLayout.font,
        paper_bgcolor: baseLayout.paper_bgcolor,
        plot_bgcolor: baseLayout.plot_bgcolor,
        hovermode: baseLayout.hovermode,
        margin: { l: 80, r: 80, t: 80, b: 100 },
        title: {
            text: 'Mapa Factorial de Categorías de Variables',
            font: { color: '#e0e0e0' }
        },
        xaxis: {
            title: 'Dimensión 1',
            zeroline: true,
            zerolinewidth: 2,
            zerolinecolor: academicBlue,
            range: [-2, 3],
            color: '#e0e0e0',
            gridcolor: '#2a3442'
        },
        yaxis: {
            title: 'Dimensión 2',
            zeroline: true,
            zerolinewidth: 2,
            zerolinecolor: academicBlue,
            range: [-2, 3.5],
            color: '#e0e0e0',
            gridcolor: '#2a3442'
        },
        showlegend: false,
        height: 700
    };

    console.log('Creando gráfico de categorías...');
    try {
        Plotly.newPlot('categories-map', [trace], layout, plotlyConfig);
        console.log('Gráfico de categorías creado exitosamente');
    } catch (error) {
        console.error('Error al crear gráfico de categorías:', error);
    }
}

// 4. Biplot (individuos + categorías)
function createBiplot(individuals, categories) {
    const clusters = [...new Set(individuals.cluster)].sort();

    // Traces de individuos (más pequeños y transparentes)
    const individualTraces = clusters.map(cluster => {
        const indices = individuals.cluster.map((c, i) => c === cluster ? i : -1).filter(i => i !== -1);
        return {
            x: indices.map(i => individuals.dim1[i]),
            y: indices.map(i => individuals.dim2[i]),
            mode: 'markers',
            type: 'scatter',
            name: `Cluster ${cluster}`,
            marker: {
                color: clusterColors[cluster],
                size: 6,
                opacity: 0.6,
                line: { color: '#0a0e14', width: 0.5 }
            },
            text: indices.map(i => `Ind ${i + 1} (C${cluster})`),
            hovertemplate: '%{text}<br>Dim1: %{x:.3f}<br>Dim2: %{y:.3f}<extra></extra>'
        };
    });

    // Filtrar categorías que NO contienen "Missing" para el biplot
    const filteredCategories = {
        x: [],
        y: [],
        text: []
    };

    categories.category.forEach((cat, i) => {
        // Excluir si contiene "Missing" (case insensitive)
        if (!cat.toLowerCase().includes('missing')) {
            filteredCategories.x.push(categories.dim1[i]);
            filteredCategories.y.push(categories.dim2[i]);
            // Limpiar nombre (quitar prefijo de variable)
            const parts = cat.split('__');
            filteredCategories.text.push(parts.length > 1 ? parts[1] : cat);
        }
    });

    // Variar posiciones de texto para evitar superposiciones en biplot
    const biplotTextPositions = [];
    const biplotPositions = ['top center', 'bottom center', 'middle right', 'middle left', 'top right', 'top left', 'bottom right', 'bottom left'];
    for (let i = 0; i < filteredCategories.text.length; i++) {
        biplotTextPositions.push(biplotPositions[i % biplotPositions.length]);
    }

    // Trace de categorías (más discretos)
    const categoryTrace = {
        x: filteredCategories.x,
        y: filteredCategories.y,
        mode: 'markers+text',
        type: 'scatter',
        name: 'Categorías',
        marker: {
            color: '#9b59b6',
            size: 10,
            symbol: 'diamond',
            line: { color: academicBlue, width: 1.5 }
        },
        text: filteredCategories.text,
        textposition: biplotTextPositions,
        textfont: { size: 7, color: academicBlue, weight: 'bold' },
        hovertemplate: '<b>%{text}</b><br>Dim1: %{x:.3f}<br>Dim2: %{y:.3f}<extra></extra>'
    };

    const layout = {
        ...baseLayout,
        title: {
            text: 'Biplot: Individuos y Categorías',
            font: { color: '#e0e0e0' }
        },
        xaxis: {
            title: 'Dimensión 1',
            zeroline: true,
            zerolinewidth: 2,
            zerolinecolor: academicBlue,
            color: '#e0e0e0',
            gridcolor: '#2a3442'
        },
        yaxis: {
            title: 'Dimensión 2',
            zeroline: true,
            zerolinewidth: 2,
            zerolinecolor: academicBlue,
            color: '#e0e0e0',
            gridcolor: '#2a3442'
        },
        showlegend: true,
        legend: {
            x: 1.02,
            y: 1,
            bgcolor: 'rgba(21, 27, 35, 0.8)',
            bordercolor: '#2a3442',
            font: { color: '#e0e0e0' }
        }
    };

    Plotly.newPlot('biplot', [...individualTraces, categoryTrace], layout, plotlyConfig);
}

// 5. Visualización 3D
function create3DPlot(individuals) {
    const clusters = [...new Set(individuals.cluster)].sort();

    const traces = clusters.map(cluster => {
        const indices = individuals.cluster.map((c, i) => c === cluster ? i : -1).filter(i => i !== -1);
        return {
            x: indices.map(i => individuals.dim1[i]),
            y: indices.map(i => individuals.dim2[i]),
            z: indices.map(i => individuals.dim3[i]),
            mode: 'markers',
            type: 'scatter3d',
            name: `Cluster ${cluster}`,
            marker: {
                color: clusterColors[cluster],
                size: 5,
                line: { color: '#0a0e14', width: 0.5 }
            },
            text: indices.map(i => `Individuo ${i + 1}<br>Cluster ${cluster}`),
            hovertemplate: '%{text}<br>Dim1: %{x:.3f}<br>Dim2: %{y:.3f}<br>Dim3: %{z:.3f}<extra></extra>'
        };
    });

    const layout = {
        ...baseLayout,
        title: {
            text: 'Visualización 3D del Espacio Factorial',
            font: { color: '#e0e0e0' }
        },
        scene: {
            xaxis: {
                title: 'Dimensión 1',
                color: '#e0e0e0',
                gridcolor: '#2a3442',
                backgroundcolor: '#0a0e14'
            },
            yaxis: {
                title: 'Dimensión 2',
                color: '#e0e0e0',
                gridcolor: '#2a3442',
                backgroundcolor: '#0a0e14'
            },
            zaxis: {
                title: 'Dimensión 3',
                color: '#e0e0e0',
                gridcolor: '#2a3442',
                backgroundcolor: '#0a0e14'
            },
            camera: {
                eye: { x: 1.5, y: 1.5, z: 1.3 }
            },
            bgcolor: '#0a0e14'
        },
        showlegend: true,
        legend: {
            x: 0,
            y: 1,
            bgcolor: 'rgba(21, 27, 35, 0.8)',
            bordercolor: '#2a3442',
            font: { color: '#e0e0e0' }
        }
    };

    Plotly.newPlot('plot-3d', traces, layout, plotlyConfig);
}

// 6. Distribución de clusters
function createClusterDistribution(clusters) {
    const clusterIds = Object.keys(clusters.sizes).map(Number).sort();
    const sizes = clusterIds.map(id => clusters.sizes[id.toString()]);
    const colors = clusterIds.map(id => clusterColors[id]);

    const trace = {
        x: clusterIds.map(id => `Cluster ${id}`),
        y: sizes,
        type: 'bar',
        marker: {
            color: colors,
            line: { color: '#0a0e14', width: 2 }
        },
        text: sizes.map(s => `${s} individuos`),
        textposition: 'outside',
        textfont: { color: '#e0e0e0' },
        hovertemplate: '<b>%{x}</b><br>Individuos: %{y}<extra></extra>'
    };

    const layout = {
        ...baseLayout,
        title: {
            text: 'Distribución de Individuos por Cluster',
            font: { color: '#e0e0e0' }
        },
        xaxis: {
            title: 'Cluster',
            color: '#e0e0e0',
            gridcolor: '#2a3442'
        },
        yaxis: {
            title: 'Número de Individuos',
            color: '#e0e0e0',
            gridcolor: '#2a3442'
        },
        showlegend: false
    };

    Plotly.newPlot('cluster-distribution', [trace], layout, plotlyConfig);
}

// 7. Mapa Geográfico de Misiones
function createMisionesMap(geoData) {
    console.log('Creando mapa de Misiones...', geoData);

    const departamentos = geoData.departamentos;

    // Colores por clase predominante
    const classColors = {
        'Caza como estrategia': '#e74c3c',
        'Caza como tactica': '#3498db',
        'Caza comb de lugareños': '#2ecc71',
        'Caza comb de extranjeros': '#9b59b6',
        'Caza comb de capitalinos': '#f39c12'
    };

    // Preparar datos para cada clase
    const clasesUnicas = geoData.metadata.clases_disponibles;
    const traces = [];

    clasesUnicas.forEach(clase => {
        const deptsFiltrados = departamentos.filter(d => d.clase_predominante === clase);

        if (deptsFiltrados.length > 0) {
            const trace = {
                type: 'scattergeo',
                lon: deptsFiltrados.map(d => d.lon),
                lat: deptsFiltrados.map(d => d.lat),
                text: deptsFiltrados.map(d => d.name),
                mode: 'markers+text',
                name: clase,
                marker: {
                    size: deptsFiltrados.map(d => Math.sqrt(d.total_casos) * 8 + 8),
                    color: classColors[clase] || '#95a5a6',
                    line: {
                        color: '#0a0e14',
                        width: 2
                    },
                    opacity: 0.9
                },
                textposition: 'top center',
                textfont: {
                    size: 9,
                    color: academicBlue,
                    family: '"IBM Plex Mono", "Courier New", monospace'
                },
                hovertemplate: '<b>%{text}</b><br>' +
                               'Casos: ' + deptsFiltrados.map(d => d.total_casos).map(c => '%{marker.size}') +
                               '<br>Clase: ' + clase +
                               '<extra></extra>',
                customdata: deptsFiltrados.map(d => ({
                    total: d.total_casos,
                    clase: clase,
                    detalle: d.clases_detalle
                })),
                hovertemplate: deptsFiltrados.map(d =>
                    `<b>${d.name}</b><br>` +
                    `Total casos: ${d.total_casos}<br>` +
                    `Clase predominante: ${d.clase_predominante}<br>` +
                    `<extra></extra>`
                )
            };
            traces.push(trace);
        }
    });

    const layout = {
        font: baseLayout.font,
        title: {
            text: 'Distribución Geográfica de Caza Ilegal en Misiones',
            font: { color: '#e0e0e0' }
        },
        paper_bgcolor: '#151b23',
        geo: {
            scope: 'south america',
            center: { lat: -26.8, lon: -54.6 },
            projection: { type: 'mercator' },
            showland: true,
            landcolor: '#1a2332',
            showlakes: true,
            lakecolor: '#005080',
            showcountries: true,
            countrycolor: academicBlue,
            countrywidth: 2,
            showsubunits: true,
            subunitcolor: '#2a3442',
            subunitwidth: 1,
            showrivers: true,
            rivercolor: '#005080',
            riverwidth: 2,
            lonaxis: { range: [-56.5, -53.3] },
            lataxis: { range: [-28.5, -25.3] },
            resolution: 50,
            bgcolor: '#0a0e14'
        },
        showlegend: true,
        legend: {
            x: 0.02,
            y: 0.98,
            bgcolor: 'rgba(21, 27, 35, 0.95)',
            bordercolor: academicBlue,
            borderwidth: 2,
            font: { size: 11, color: '#e0e0e0' }
        },
        margin: { l: 20, r: 20, t: 80, b: 40 },
        height: 650
    };

    Plotly.newPlot('misiones-map', traces, layout, plotlyConfig);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadData);
