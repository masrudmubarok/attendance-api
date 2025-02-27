const redisClient = require('../../Infrastructure/Redis/Client');

module.exports = (token) => async () => {
  try {
    if (token) {
      await redisClient.del(`jwt:${token}`);
    }
    return { message: 'Logout successful' };
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};