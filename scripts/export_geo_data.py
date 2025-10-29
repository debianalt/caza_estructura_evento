#!/usr/bin/env python3
"""
Script para exportar datos geográficos de Misiones para visualización en mapa
"""

import pandas as pd
import json
from pathlib import Path

# Coordenadas aproximadas de los departamentos de Misiones (centro aproximado)
DEPARTAMENTOS_COORDS = {
    'CAPITAL': {'lat': -27.3671, 'lon': -55.8961, 'name': 'Capital (Posadas)'},
    'IGUAZÚ': {'lat': -25.6953, 'lon': -54.4367, 'name': 'Iguazú'},
    'GENERAL MANUEL BELGRANO': {'lat': -26.0833, 'lon': -53.7500, 'name': 'Gral. M. Belgrano'},
    'ELDORADO': {'lat': -26.4167, 'lon': -54.6167, 'name': 'Eldorado'},
    'GUARANÍ': {'lat': -27.0000, 'lon': -54.8333, 'name': 'Guaraní'},
    'CAINGUÁS': {'lat': -26.9167, 'lon': -55.0833, 'name': 'Cainguás'},
    'SAN PEDRO': {'lat': -26.6167, 'lon': -54.1167, 'name': 'San Pedro'},
    '25 DE MAYO': {'lat': -27.3833, 'lon': -54.7500, 'name': '25 de Mayo'},
    'LIBERTADOR GENERAL SAN MARTÍN': {'lat': -26.8667, 'lon': -54.7167, 'name': 'L. Gral. San Martín'},  # Corregido: más al centro-este
    'SAN JAVIER': {'lat': -27.8833, 'lon': -55.1333, 'name': 'San Javier'},  # Ajustado: sur de Misiones
    'CANDELARIA': {'lat': -27.4667, 'lon': -55.7500, 'name': 'Candelaria'},
    'LEANDRO N. ALEM': {'lat': -27.5833, 'lon': -55.3167, 'name': 'L. N. Alem'},
    'OBERÁ': {'lat': -27.4833, 'lon': -55.1167, 'name': 'Oberá'},
    'SAN IGNACIO': {'lat': -27.2500, 'lon': -55.5333, 'name': 'San Ignacio'},
    'MONTECARLO': {'lat': -26.5667, 'lon': -54.7500, 'name': 'Montecarlo'},
    'APÓSTOLES': {'lat': -27.9167, 'lon': -55.7667, 'name': 'Apóstoles'},
    'CONCEPCIÓN': {'lat': -28.3833, 'lon': -55.5667, 'name': 'Concepción'}
}

# Cargar datos
print("Cargando datos...")
df = pd.read_csv('data/raw/Cazadores.csv')

# Filtrar solo departamentos de Misiones (excluir Brasil, Paraguay, Corrientes)
misiones_depts = [k for k in DEPARTAMENTOS_COORDS.keys()]
df_misiones = df[df['DEPARTAMENTO'].isin(misiones_depts)].copy()

print(f"Total registros en Misiones: {len(df_misiones)}")
print(f"Departamentos: {df_misiones['DEPARTAMENTO'].nunique()}")

# Contar por departamento y clase
dept_class_counts = df_misiones.groupby(['DEPARTAMENTO', 'CLASES']).size().reset_index(name='count')

# Preparar datos para el mapa
map_data = []

for dept in df_misiones['DEPARTAMENTO'].unique():
    if dept not in DEPARTAMENTOS_COORDS:
        continue

    dept_data = df_misiones[df_misiones['DEPARTAMENTO'] == dept]
    coords = DEPARTAMENTOS_COORDS[dept]

    # Contar por clase
    class_counts = dept_data['CLASES'].value_counts().to_dict()
    total = len(dept_data)

    # Clase predominante
    main_class = dept_data['CLASES'].mode()[0] if len(dept_data) > 0 else 'N/A'

    map_data.append({
        'departamento': dept,
        'name': coords['name'],
        'lat': coords['lat'],
        'lon': coords['lon'],
        'total_casos': total,
        'clase_predominante': main_class,
        'clases_detalle': class_counts,
        'cluster_counts': dept_data['Cluster'].value_counts().to_dict() if 'Cluster' in dept_data.columns else {}
    })

# Ordenar por total de casos
map_data = sorted(map_data, key=lambda x: x['total_casos'], reverse=True)

# Resumen general
summary = {
    'total_casos': len(df_misiones),
    'departamentos': len(map_data),
    'clases': df_misiones['CLASES'].value_counts().to_dict(),
    'top_departamentos': [
        {'name': d['name'], 'casos': d['total_casos']}
        for d in map_data[:5]
    ]
}

# Exportar
output = {
    'summary': summary,
    'departamentos': map_data,
    'metadata': {
        'provincia': 'Misiones',
        'pais': 'Argentina',
        'clases_disponibles': list(df_misiones['CLASES'].unique())
    }
}

Path('docs/data').mkdir(parents=True, exist_ok=True)
with open('docs/data/geo_misiones.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print("\n✓ Datos geográficos exportados a docs/data/geo_misiones.json")
print(f"\nTop 5 departamentos:")
for d in map_data[:5]:
    print(f"  - {d['name']}: {d['total_casos']} casos ({d['clase_predominante']})")

print(f"\nDistribución de clases:")
for clase, count in summary['clases'].items():
    print(f"  - {clase}: {count}")
