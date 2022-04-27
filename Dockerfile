FROM node:14.16.0-alpine
RUN apk add --no-cache --virtual .build-deps alpine-sdk python3
RUN mkdir -p /var/www/post
WORKDIR /var/www/post
ADD . /var/www/post
RUN npm install
CMD npm start
