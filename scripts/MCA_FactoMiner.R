# Import data 
setwd("C:/users/houee/Downloads") # select the working directory
hobbies = read.table("data_MCA_Hobbies.csv", header=TRUE, sep=";")
# You can also load the data that are available in the FactoMineR package
# data(hobbies)

summary(hobbies)

# Loading FactoMineR
library(FactoMineR)

# Transform the TV variable as factor
hobbies[,"TV"] = as.factor(hobbies[,"TV"])

# MCA with the graphs given by default
res.mca <- MCA(hobbies,quali.sup=19:22,quanti.sup=23)

summary(res.mca)

# Graph of the eigenvalues
barplot(res.mca$eig[,2],main="Eigenvalues", names.arg=1:nrow(res.mca$eig))

# Graphs of the individuals
plot(res.mca,invisible=c("var","quali.sup"),cex=.5,label="none",title="Graph of the individuals") 
plot(res.mca,invisible=c("var","quali.sup"),cex=.5,label="none",title="Graph of the individuals", habillage="Gardening") 

# Graphs of the categories
plot(res.mca,invis=c("ind","quali.sup"),col.var=c(rep(c("black","red"),17),"black",rep("red",4)),title="Graph of the active categories")
plot(res.mca,invisible=c("ind","var"),hab="quali", palette=palette(c("blue","maroon","darkgreen","black","red")), title="Graph of the supplementary categories")

# Graphs of the variables
plot(res.mca,choix="var",title="Graph of the variables")
plot(res.mca,choix="quanti.sup",title="Graph of the continuous variables")

# Description of the dimensions
dimdesc(res.mca)

# Confidence ellipses around the categories for the first 4 variables
plotellipses(res.mca, cex=0.2, magnify=12, keepvar=1:4)




