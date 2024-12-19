FROM node:20-alpine

WORKDIR /app/notification

COPY package*.json ./
RUN npm install 

COPY . . 

EXPOSE 5672 

CMD ["npm", "start"]