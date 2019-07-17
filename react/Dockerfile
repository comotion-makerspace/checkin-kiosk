FROM mhart/alpine-node:11 AS builder

WORKDIR /home/react

COPY . /home/react


RUN set -x \
    && adduser -h /home/react -D -u 6740 react

USER react
ENV USER=react

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]