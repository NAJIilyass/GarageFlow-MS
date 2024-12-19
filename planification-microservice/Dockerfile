FROM node:20-alpine

WORKDIR /app/planification

COPY package*.json ./
RUN npm install 

COPY . . 

EXPOSE 5003 

CMD ["npm", "start"]