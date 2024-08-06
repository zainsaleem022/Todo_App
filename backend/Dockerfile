FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm install --force && npm install -g nodemon

COPY . .

EXPOSE 5000

CMD ["nodemon", "startServer.js"]
