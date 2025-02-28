FROM node:22.13.1-alpine

# Menggunakan path yang benar dalam container
WORKDIR /app

# Salin package.json sebelum menyalin semua file untuk mengoptimalkan cache
COPY package*.json ./

RUN npm install --package-lock-only

COPY . .

EXPOSE 3000

CMD ["npm", "start"]