FROM node:13-alpine
ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=ericsson
RUN mkdir -p /home/app
COPY . /home/app
RUN npm install express
RUN npm install body-parser
RUN npm install mogodb
CMD ["node","/home/app/server.js"]