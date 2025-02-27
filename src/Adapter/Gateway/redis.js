const redisClient = require('../../Infrastructure/Redis/Client');

const redisGateway = {
  async get(key) {
    return await redisClient.get(key);
  },
  async set(key, value, expiration = 3600) {
    await redisClient.set(key, JSON.stringify(value), 'EX', expiration);
  },
  async delete(key) {
    await redisClient.del(key);
  }
};

module.exports = redisGateway;