FROM node:14.17.0-alpine

WORKDIR /api

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]
