#Elementos básicos
#Para elegir archivos para abrir
read.csv(file.choose())

#Para listar las variables
head() 

# Para conocer la estructura del data frame
str()

# Devuelve el número de filas y columnas
dim() 

# Listamos los nombres de las variables (cabecera)
names()

#Editar tablas
DataEditR::data_edit()

# Convertir a variables factoriales...
Cazadores[, 1:6] <- lapply(Cazadores[, 1:6], as.factor)


#Convertir a variables númericas...
Cazadores[,7:12] <-lapply(Cazadores[,7:12], as.numeric)

# exclude 3rd and 5th variable 
newdata <- mydata[c(-3,-5)]


# Anular una o varias variable del análisis
nuevodataframe <- dataframe1 [,-x:-y] 


#Eliminar una variable de la matriz
dataframe1$nombrecolumna <- NULL 

# delete variables v3 and v5
mydata$v3 <- mydata$v5 <- NULL


# Devuelve el número de filas y columnas
dim()

# Seleccionar valores de una variable
Cazadores <- Cazadores[ which(Cazadores$DEPARTAMENTO!="CAPITAL"),]

newdata <- mydata[ which(mydata$gender=='F'
                         & mydata$age > 65), ]


# Convertir a variables factoriales...
Cazadores[, 1:6] <- lapply(Cazadores[, 1:6], as.factor)

#

#