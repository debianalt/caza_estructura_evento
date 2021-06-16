
#MCA CATEGORIAS ACTIVAS


# MCA CATEGORIAS SUPLEMENTARIAS

# PARANGONES


#CAJ
res.MCA<-MCA(Cazadores,quanti.sup=c(7,8,9,10,11),quali.sup=c(4,6,14),graph=FALSE)
res.HCPC<-HCPC(res.MCA,nb.clust=4,consol=FALSE,graph=FALSE)
plot.HCPC(res.HCPC,choice='tree',title='Árbol jerárquico')
plot.HCPC(res.HCPC,choice='map',draw.tree=FALSE,title='Mapa factorial')
plot.HCPC(res.HCPC,choice='3D.map',ind.names=FALSE,centers.plot=FALSE,angle=60,title='Árbol jerárquico sobre mapa factorial')
