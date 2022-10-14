FROM node:17-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 1337

CMD ["node", "./source/server.ts"]