FROM node:18.18.0 as build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig*.json ./

RUN npm install

COPY . .

EXPOSE 3000
