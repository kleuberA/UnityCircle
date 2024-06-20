# Usar uma imagem base do Node.js
FROM node:21

# Definir diretório de trabalho
WORKDIR /usr/src/app/back

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && apt-get clean

# Copiar o restante do código do aplicativo
COPY . .
RUN npm install -g prisma
RUN npx prisma generate
RUN npm rebuild bcrypt --build-from-source
# Compilar o projeto (se você estiver usando TypeScript)
RUN npm run build

# Expor a porta em que o aplicativo vai rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "run", "start"]
