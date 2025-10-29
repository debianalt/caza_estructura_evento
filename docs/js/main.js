// Main JavaScript para visualizaciones MCA

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

// Layout base para gráficos
const baseLayout = {
    font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', size: 12 },
    paper_bgcolor: '#ffffff',
    plot_bgcolor: '#f8f9fa',
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

        console.log('Visualizaciones cargadas exitosamente');
    } catch (error) {
        console.error('Error al cargar datos:', error);
        alert('Error al cargar los datos del análisis MCA. Por favor, verifica que el archivo mca_results.json existe.');
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
        title: 'Valores Propios y Varianza Explicada',
        xaxis: { title: 'Dimensión', dtick: 1 },
        yaxis: { title: 'Varianza Explicada (%)', side: 'left' },
        yaxis2: {
            title: 'Varianza Acumulada (%)',
            overlaying: 'y',
            side: 'right',
            range: [0, 100]
        },
        showlegend: true,
        legend: { x: 0.7, y: 1 }
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
                line: { color: 'white', width: 1 }
            },
            text: indices.map(i => `Individuo ${i + 1}<br>Cluster ${cluster}`),
            hovertemplate: '%{text}<br>Dim1: %{x:.3f}<br>Dim2: %{y:.3f}<extra></extra>'
        };
    });

    const layout = {
        ...baseLayout,
        title: 'Mapa Factorial de Individuos por Cluster',
        xaxis: { title: 'Dimensión 1', zeroline: true, zerolinewidth: 2, zerolinecolor: '#999' },
        yaxis: { title: 'Dimensión 2', zeroline: true, zerolinewidth: 2, zerolinecolor: '#999' },
        showlegend: true,
        legend: { x: 1.02, y: 1 }
    };

    Plotly.newPlot('individuals-map', traces, layout, plotlyConfig);
}

// 3. Mapa factorial de categorías
function createCategoriesMap(categories) {
    const trace = {
        x: categories.dim1,
        y: categories.dim2,
        mode: 'markers+text',
        type: 'scatter',
        marker: {
            color: '#9b59b6',
            size: 12,
            line: { color: 'white', width: 2 }
        },
        text: categories.category,
        textposition: 'top center',
        textfont: { size: 10 },
        hovertemplate: '<b>%{text}</b><br>Dim1: %{x:.3f}<br>Dim2: %{y:.3f}<extra></extra>'
    };

    const layout = {
        ...baseLayout,
        title: 'Mapa Factorial de Categorías de Variables',
        xaxis: { title: 'Dimensión 1', zeroline: true, zerolinewidth: 2, zerolinecolor: '#999' },
        yaxis: { title: 'Dimensión 2', zeroline: true, zerolinewidth: 2, zerolinecolor: '#999' },
        showlegend: false
    };

    Plotly.newPlot('categories-map', trace, layout, plotlyConfig);
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
                opacity: 0.5,
                line: { color: 'white', width: 0.5 }
            },
            text: indices.map(i => `Ind ${i + 1} (C${cluster})`),
            hovertemplate: '%{text}<br>Dim1: %{x:.3f}<br>Dim2: %{y:.3f}<extra></extra>'
        };
    });

    // Trace de categorías (más grandes y destacados)
    const categoryTrace = {
        x: categories.dim1,
        y: categories.dim2,
        mode: 'markers+text',
        type: 'scatter',
        name: 'Categorías',
        marker: {
            color: '#2c3e50',
            size: 14,
            symbol: 'diamond',
            line: { color: 'white', width: 2 }
        },
        text: categories.category,
        textposition: 'top center',
        textfont: { size: 9, color: '#2c3e50', weight: 'bold' },
        hovertemplate: '<b>%{text}</b><br>Dim1: %{x:.3f}<br>Dim2: %{y:.3f}<extra></extra>'
    };

    const layout = {
        ...baseLayout,
        title: 'Biplot: Individuos y Categorías',
        xaxis: { title: 'Dimensión 1', zeroline: true, zerolinewidth: 2, zerolinecolor: '#999' },
        yaxis: { title: 'Dimensión 2', zeroline: true, zerolinewidth: 2, zerolinecolor: '#999' },
        showlegend: true,
        legend: { x: 1.02, y: 1 }
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
                line: { color: 'white', width: 0.5 }
            },
            text: indices.map(i => `Individuo ${i + 1}<br>Cluster ${cluster}`),
            hovertemplate: '%{text}<br>Dim1: %{x:.3f}<br>Dim2: %{y:.3f}<br>Dim3: %{z:.3f}<extra></extra>'
        };
    });

    const layout = {
        ...baseLayout,
        title: 'Visualización 3D del Espacio Factorial',
        scene: {
            xaxis: { title: 'Dimensión 1' },
            yaxis: { title: 'Dimensión 2' },
            zaxis: { title: 'Dimensión 3' },
            camera: {
                eye: { x: 1.5, y: 1.5, z: 1.3 }
            }
        },
        showlegend: true,
        legend: { x: 0, y: 1 }
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
            line: { color: 'white', width: 2 }
        },
        text: sizes.map(s => `${s} individuos`),
        textposition: 'outside',
        hovertemplate: '<b>%{x}</b><br>Individuos: %{y}<extra></extra>'
    };

    const layout = {
        ...baseLayout,
        title: 'Distribución de Individuos por Cluster',
        xaxis: { title: 'Cluster' },
        yaxis: { title: 'Número de Individuos' },
        showlegend: false
    };

    Plotly.newPlot('cluster-distribution', [trace], layout, plotlyConfig);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadData);
