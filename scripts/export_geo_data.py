#!/usr/bin/env python3
"""
Script para exportar datos geográficos de Misiones para visualización en mapa
"""

import pandas as pd
import json
from pathlib import Path

# Coordenadas corregidas de los departamentos de Misiones (centro aproximado de cada departamento)
DEPARTAMENTOS_COORDS = {
    # Zona Norte
    'IGUAZÚ': {'lat': -25.8, 'lon': -54.5, 'name': 'Iguazú'},  # Norte, frontera con Brasil
    'GENERAL MANUEL BELGRANO': {'lat': -26.1, 'lon': -53.8, 'name': 'Gral. M. Belgrano'},  # Noreste, frontera este
    'SAN PEDRO': {'lat': -26.6, 'lon': -54.1, 'name': 'San Pedro'},  # Norte-centro
    'ELDORADO': {'lat': -26.4, 'lon': -54.65, 'name': 'Eldorado'},  # Norte-centro
    'MONTECARLO': {'lat': -26.55, 'lon': -54.75, 'name': 'Montecarlo'},  # Norte-centro

    # Zona Centro
    'GUARANÍ': {'lat': -26.9, 'lon': -54.25, 'name': 'Guaraní'},  # Este, debajo de San Pedro (El Soberbio)
    'CAINGUÁS': {'lat': -27.05, 'lon': -55.0, 'name': 'Cainguás'},  # Centro (Campo Grande)
    'LIBERTADOR GENERAL SAN MARTÍN': {'lat': -26.85, 'lon': -54.95, 'name': 'L. Gral. San Martín'},  # Centro
    '25 DE MAYO': {'lat': -27.35, 'lon': -54.75, 'name': '25 de Mayo'},  # Centro-este (Alba Posse)
    'OBERÁ': {'lat': -27.5, 'lon': -55.15, 'name': 'Oberá'},  # Centro (ciudad de Oberá)
    'LEANDRO N. ALEM': {'lat': -27.6, 'lon': -55.35, 'name': 'L. N. Alem'},  # Centro-oeste

    # Zona Sur
    'CAPITAL': {'lat': -27.37, 'lon': -55.89, 'name': 'Capital (Posadas)'},  # Sur, capital
    'SAN IGNACIO': {'lat': -27.25, 'lon': -55.53, 'name': 'San Ignacio'},  # Sur, cerca de Posadas
    'CANDELARIA': {'lat': -27.47, 'lon': -55.75, 'name': 'Candelaria'},  # Sur, sobre el Paraná
    'SAN JAVIER': {'lat': -27.87, 'lon': -55.13, 'name': 'San Javier'},  # Sur
    'APÓSTOLES': {'lat': -27.92, 'lon': -55.77, 'name': 'Apóstoles'},  # Sur-oeste
    'CONCEPCIÓN': {'lat': -28.0, 'lon': -55.55, 'name': 'Concepción'}  # Extremo sur
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
