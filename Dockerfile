FROM node:18-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE $PORT

CMD ["node", "index"]
