FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx tsc -b

EXPOSE 3000
CMD [ "node", "express-app.js" ]