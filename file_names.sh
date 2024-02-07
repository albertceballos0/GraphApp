#!/bin/bash

# Directorio donde se encuentran los archivos .GR
directorio="./TestSalesMan"

# Patron para filtrar archivos .GR
patron="*.GR"

# Archivo de salida CSV
archivo_salida="nombres_archivos.csv"

# Escribir cabecera en el archivo CSV
echo "nombre_archivo,nodos,aristas" > $archivo_salida

# Iterar sobre los archivos .GR en el directorio
for archivo in "$directorio"/$patron; do
    # Obtener nombre de archivo sin ruta ni extensión
    nombre_archivo=$(basename "$archivo" .GR)
    # Extraer nodos y aristas del nombre del archivo
    nodos=$(echo "$nombre_archivo" | awk -F_ '{print $1}' | sed 's/[^0-9]*//g')
    aristas=$(echo "$nombre_archivo" | awk -F_ '{print $2}' | sed 's/[^0-9]*//g')
  
    visitas=$(echo "$nombre_archivo" | awk -F_ '{print $3}' | sed 's/[^0-9]*//g')

    # Escribir en el archivo CSV
    echo "$nombre_archivo,$nodos,$aristas,$visitas" >> $archivo_salida
done

echo "Se ha generado el archivo '$archivo_salida' con éxito."

