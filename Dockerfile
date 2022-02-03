FROM node:14.8.0-alpine
RUN npm install -g npm@6.14.7
RUN mkdir -p /var/www/post
WORKDIR /var/www/post
ADD . /var/www/post
RUN npm install
CMD npm start