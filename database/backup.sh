#!/bin/bash

# Variables
USER="root"
PASSWORD=""
NEW_DATABASE="GraphApp"
BACKUP_FILE="backup.sql"

# Crear la nueva base de datos desde el archivo de respaldo modificado
mysql -u $USER -p$PASSWORD < $BACKUP_FILE

echo "La nueva base de datos '$NEW_DATABASE' ha sido creada."
