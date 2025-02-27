require('dotenv').config();

module.exports = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  elasticsearch: {
    node: process.env.ELASTICSEARCH_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  port: process.env.PORT || 3000,
};