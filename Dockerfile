FROM node:22.13.1

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y build-essential python3

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]