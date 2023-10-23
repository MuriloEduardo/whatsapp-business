FROM node:18-slim

WORKDIR /app

COPY . .

RUN npm ci

EXPOSE $PORT

CMD ["node", "index"]
