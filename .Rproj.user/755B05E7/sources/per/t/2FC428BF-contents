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

# Convertir a variables factoriales...
Cazadores[, 1:6] <- lapply(Cazadores[, 1:6], as.factor)
str(Cazadores)


#Convertir a variables númericas...
Cazadores[,7:12] <-lapply(Cazadores[,7:12], as.numeric)

# exclude 3rd and 5th variable 
newdata <- mydata[c(-3,-5)]


# delete variables v3 and v5
mydata$v3 <- mydata$v5 <- NULL

Cazadores$PISTOLAS <- NULL

# Select observations based on variable values...
# based on variable values
newdata <- mydata[ which(mydata$gender=='F' 
                         & mydata$age > 65), ]

newdata <- Cazadores[ which(Cazadores$DEP!="CAPITAL"),] 

#iniciar factoshiny...
Factoshiny(Cazadores)

library("factoextra")
library("FactoMineR")

res.mca <- MCA(Caza_breve, quanti.sup = 9:10, quali.sup = 15:16, graph = F)
#Como volver factor a variables character
Cazadores[, 1:20] <- lapply(Cazadores[, 1:20], as.factor)

library(Factoshiny)
