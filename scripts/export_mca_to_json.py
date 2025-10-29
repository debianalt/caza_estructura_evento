#!/usr/bin/env python3
"""
Script para exportar resultados del MCA a JSON para GitHub Pages
Alternativa en Python al script R
"""

import pandas as pd
import numpy as np
import json
from pathlib import Path

# Instalar prince si es necesario: pip install prince scikit-learn
try:
    import prince
    from sklearn.cluster import AgglomerativeClustering
except ImportError:
    print("Instalando dependencias necesarias...")
    import subprocess
    subprocess.check_call(['pip', 'install', 'prince', 'scikit-learn', 'scipy'])
    import prince
    from sklearn.cluster import AgglomerativeClustering

# Cargar datos
print("Cargando datos...")
df = pd.read_csv('data/raw/Cazadores.csv')

# Limpiar datos - remover filas con demasiados NaN
df_clean = df.dropna(thresh=len(df.columns) * 0.5)

# Identificar columnas categóricas y numéricas
categorical_cols = ['MOVILIDAD', 'MIEMBROS', 'DECOMISO', 'GENERO', 'RAMA', 'BENEFICIOS', 'CLASES']
numeric_cols = ['RIFLES', 'ESCOPETA', 'MACHETES', 'CUCHILLOS', 'OAD_FUEGO']

# Preparar datos para MCA - solo columnas categóricas activas
mca_cols = [col for col in categorical_cols if col in df_clean.columns and col != 'CLASES']
X = df_clean[mca_cols].copy()

# Llenar NaN en categóricas con 'Missing'
for col in X.columns:
    X[col] = X[col].fillna('Missing')
    X[col] = X[col].astype(str)

print(f"Ejecutando MCA con {len(mca_cols)} variables activas...")
print(f"Variables: {mca_cols}")

# Ejecutar MCA
mca = prince.MCA(
    n_components=5,
    n_iter=10,
    copy=True,
    check_input=True,
    engine='sklearn',
    random_state=42
)

mca = mca.fit(X)

# Obtener coordenadas de individuos
ind_coords = mca.transform(X)

# Obtener coordenadas de categorías
cat_coords = mca.column_coordinates(X)

# Realizar clustering jerárquico
print("Realizando clustering jerárquico...")
clustering = AgglomerativeClustering(n_clusters=4, linkage='ward')
clusters = clustering.fit_predict(ind_coords.iloc[:, :3])

# Preparar datos para exportar
export_data = {
    'eigenvalues': {
        'dim': list(range(1, len(mca.eigenvalues_) + 1)),
        'eigenvalue': mca.eigenvalues_.tolist(),
        'variance_percent': (mca.eigenvalues_ / mca.eigenvalues_.sum() * 100).tolist(),
        'cumulative_percent': np.cumsum(mca.eigenvalues_ / mca.eigenvalues_.sum() * 100).tolist()
    },

    'individuals': {
        'id': list(range(len(ind_coords))),
        'dim1': ind_coords.iloc[:, 0].tolist(),
        'dim2': ind_coords.iloc[:, 1].tolist(),
        'dim3': ind_coords.iloc[:, 2].tolist() if ind_coords.shape[1] > 2 else [0] * len(ind_coords),
        'cluster': (clusters + 1).tolist()  # +1 para que empiece en 1 como en R
    },

    'categories': {
        'category': cat_coords.index.tolist(),
        'dim1': cat_coords.iloc[:, 0].tolist(),
        'dim2': cat_coords.iloc[:, 1].tolist(),
        'dim3': cat_coords.iloc[:, 2].tolist() if cat_coords.shape[1] > 2 else [0] * len(cat_coords)
    },

    'clusters': {
        'sizes': {str(i+1): int(np.sum(clusters == i)) for i in range(4)}
    },

    'metadata': {
        'n_individuals': len(ind_coords),
        'n_categories': len(cat_coords),
        'active_variables': mca_cols,
        'n_clusters': 4,
        'total_inertia': float(mca.total_inertia_)
    }
}

# Crear directorio de salida
Path('docs/data').mkdir(parents=True, exist_ok=True)

# Exportar a JSON
with open('docs/data/mca_results.json', 'w', encoding='utf-8') as f:
    json.dump(export_data, f, indent=2, ensure_ascii=False)

# Exportar datos con clusters
df_clean_subset = df_clean.copy()
df_clean_subset['Cluster'] = clusters + 1
df_clean_subset.to_csv('docs/data/cazadores_clustered.csv', index=False)

print("✓ Datos exportados exitosamente a docs/data/")
print("  - mca_results.json")
print("  - cazadores_clustered.csv")
print(f"\nResumen:")
print(f"  - Individuos: {len(ind_coords)}")
print(f"  - Categorías: {len(cat_coords)}")
print(f"  - Varianza explicada (Dim1+Dim2): {export_data['eigenvalues']['cumulative_percent'][1]:.2f}%")
print(f"  - Tamaños de clusters: {export_data['clusters']['sizes']}")
