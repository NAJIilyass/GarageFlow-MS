FROM node:20-alpine

WORKDIR /app/invoice

COPY package*.json ./
RUN npm install 

COPY . . 

EXPOSE 5004 

CMD ["npm", "start"]