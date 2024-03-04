FROM node:18.18.0 as build

WORKDIR /app

COPY  package.json ./
COPY  package-lock.json ./
COPY  tsconfig*.json ./

RUN npm install

COPY . .

RUN npm run prisma:generate
RUN npm run test:unitaire

EXPOSE 3000

CMD [ "npm", "run", "start:dev"]