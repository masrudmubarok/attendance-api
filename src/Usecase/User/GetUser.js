const userRepository = require('../../Repository/UserRepository');

module.exports = async (userId) => {
  try {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};