#!/usr/bin/env python3
"""
Exportar áreas naturales protegidas de Misiones para visualización
"""

import json
from pathlib import Path

# Principales áreas naturales protegidas de Misiones
# Coordenadas aproximadas de polígonos (esquinas de cada área)
PROTECTED_AREAS = [
    {
        'name': 'Parque Nacional Iguazú',
        'type': 'Parque Nacional',
        'area_ha': 67620,
        'polygon': [
            [-25.55, -54.6],  # noroeste
            [-25.55, -54.1],  # noreste
            [-25.8, -54.1],   # sureste
            [-25.8, -54.6],   # suroeste
            [-25.55, -54.6]   # cierre
        ]
    },
    {
        'name': 'Reserva de Biosfera Yabotí',
        'type': 'Reserva de Biosfera',
        'area_ha': 236313,
        'polygon': [
            [-26.5, -53.7],   # noroeste
            [-26.5, -53.4],   # noreste
            [-27.2, -53.4],   # sureste
            [-27.2, -53.7],   # suroeste
            [-26.5, -53.7]    # cierre
        ]
    },
    {
        'name': 'Parque Provincial Urugua-í',
        'type': 'Parque Provincial',
        'area_ha': 84000,
        'polygon': [
            [-25.9, -54.1],
            [-25.9, -53.8],
            [-26.15, -53.8],
            [-26.15, -54.1],
            [-25.9, -54.1]
        ]
    },
    {
        'name': 'Parque Provincial Moconá',
        'type': 'Parque Provincial',
        'area_ha': 1000,
        'polygon': [
            [-27.12, -53.88],
            [-27.12, -53.82],
            [-27.18, -53.82],
            [-27.18, -53.88],
            [-27.12, -53.88]
        ]
    },
    {
        'name': 'Parque Provincial Cruce Caballero',
        'type': 'Parque Provincial',
        'area_ha': 507,
        'polygon': [
            [-26.45, -54.95],
            [-26.45, -54.9],
            [-26.52, -54.9],
            [-26.52, -54.95],
            [-26.45, -54.95]
        ]
    },
    {
        'name': 'Parque Provincial Puerto Península',
        'type': 'Parque Provincial',
        'area_ha': 6800,
        'polygon': [
            [-26.25, -54.7],
            [-26.25, -54.55],
            [-26.35, -54.55],
            [-26.35, -54.7],
            [-26.25, -54.7]
        ]
    },
    {
        'name': 'Parque Provincial Cañadón de Profundidad',
        'type': 'Parque Provincial',
        'area_ha': 102,
        'polygon': [
            [-27.25, -55.52],
            [-27.25, -55.48],
            [-27.28, -55.48],
            [-27.28, -55.52],
            [-27.25, -55.52]
        ]
    },
    {
        'name': 'Parque Provincial Salto Encantado',
        'type': 'Parque Provincial',
        'area_ha': 13227,
        'polygon': [
            [-27.45, -55.05],
            [-27.45, -54.9],
            [-27.55, -54.9],
            [-27.55, -55.05],
            [-27.45, -55.05]
        ]
    }
]

# Exportar
output = {
    'protected_areas': PROTECTED_AREAS,
    'metadata': {
        'total_areas': len(PROTECTED_AREAS),
        'total_area_ha': sum(area['area_ha'] for area in PROTECTED_AREAS),
        'types': list(set(area['type'] for area in PROTECTED_AREAS))
    }
}

Path('docs/data').mkdir(parents=True, exist_ok=True)
with open('docs/data/protected_areas.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print("✓ Áreas protegidas exportadas a docs/data/protected_areas.json")
print(f"\nTotal: {len(PROTECTED_AREAS)} áreas protegidas")
print(f"Área total: {output['metadata']['total_area_ha']:,} hectáreas")
print("\nÁreas:")
for area in PROTECTED_AREAS:
    print(f"  - {area['name']} ({area['area_ha']:,} ha)")
