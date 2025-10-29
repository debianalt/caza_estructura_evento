# Script para exportar resultados del MCA a JSON para GitHub Pages
# Instalar paquetes si es necesario
if (!require("FactoMineR")) install.packages("FactoMineR")
if (!require("jsonlite")) install.packages("jsonlite")

library(FactoMineR)
library(jsonlite)

# Cargar datos
Cazadores <- read.csv("data/raw/Cazadores.csv", header = TRUE, sep = ",", stringsAsFactors = TRUE)

# Ejecutar MCA (mismo análisis que en MCA.R)
res.MCA <- MCA(Cazadores,
               quanti.sup = c(7, 8, 9, 10, 11),
               quali.sup = c(4, 6, 14),
               graph = FALSE)

# Ejecutar HCPC (clustering jerárquico)
res.HCPC <- HCPC(res.MCA, nb.clust = 4, consol = FALSE, graph = FALSE)

# Preparar datos para exportar
export_data <- list(
  # Eigenvalues (valores propios)
  eigenvalues = data.frame(
    dim = 1:nrow(res.MCA$eig),
    eigenvalue = res.MCA$eig[, 1],
    variance_percent = res.MCA$eig[, 2],
    cumulative_percent = res.MCA$eig[, 3]
  ),

  # Coordenadas de individuos
  individuals = data.frame(
    id = rownames(res.MCA$ind$coord),
    dim1 = res.MCA$ind$coord[, 1],
    dim2 = res.MCA$ind$coord[, 2],
    dim3 = if(ncol(res.MCA$ind$coord) >= 3) res.MCA$ind$coord[, 3] else rep(0, nrow(res.MCA$ind$coord)),
    cos2_dim1 = res.MCA$ind$cos2[, 1],
    cos2_dim2 = res.MCA$ind$cos2[, 2],
    contrib_dim1 = res.MCA$ind$contrib[, 1],
    contrib_dim2 = res.MCA$ind$contrib[, 2],
    cluster = res.HCPC$data.clust$clust
  ),

  # Coordenadas de variables/categorías
  categories = data.frame(
    category = rownames(res.MCA$var$coord),
    dim1 = res.MCA$var$coord[, 1],
    dim2 = res.MCA$var$coord[, 2],
    dim3 = if(ncol(res.MCA$var$coord) >= 3) res.MCA$var$coord[, 3] else rep(0, nrow(res.MCA$var$coord)),
    cos2_dim1 = res.MCA$var$cos2[, 1],
    cos2_dim2 = res.MCA$var$cos2[, 2],
    contrib_dim1 = res.MCA$var$contrib[, 1],
    contrib_dim2 = res.MCA$var$contrib[, 2]
  ),

  # Información de clusters
  clusters = list(
    description = res.HCPC$desc.var,
    centers = res.HCPC$desc.axes,
    sizes = table(res.HCPC$data.clust$clust)
  ),

  # Datos originales con clusters asignados
  raw_data = cbind(
    Cazadores,
    Cluster = res.HCPC$data.clust$clust
  )
)

# Exportar a JSON
dir.create("docs/data", recursive = TRUE, showWarnings = FALSE)
write_json(export_data, "docs/data/mca_results.json", pretty = TRUE, auto_unbox = TRUE)

# También exportar datos crudos en formato más simple
write.csv(export_data$raw_data, "docs/data/cazadores_clustered.csv", row.names = FALSE)

cat("✓ Datos exportados exitosamente a docs/data/\n")
cat("  - mca_results.json\n")
cat("  - cazadores_clustered.csv\n")
