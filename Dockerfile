# Imagen base
FROM node:18

# Crear carpeta
WORKDIR /app

# Copiar archivos
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo
COPY . .

# Exponer puerto
EXPOSE 3000

# Ejecutar app
CMD ["node", "server.js"]