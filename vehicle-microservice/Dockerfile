FROM node:20-alpine

WORKDIR /app/vehicle

COPY package*.json ./
RUN npm install 

COPY . . 

EXPOSE 5002 

CMD ["npm", "start"]