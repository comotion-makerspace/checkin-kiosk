FROM mhart/alpine-node:11 AS builder

WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]