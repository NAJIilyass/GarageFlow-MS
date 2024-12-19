FROM node:20-alpine

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install 

COPY . . 
COPY .env .env

EXPOSE 3000

CMD ["npm", "start"]