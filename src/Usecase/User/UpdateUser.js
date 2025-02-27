const userRepository = require('../../Repository/UserRepository');

module.exports = async (userId, { name, email }) => {
  try {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser && existingUser.getId() !== userId) {
      throw new Error('Email already registered');
    }

    user.setName(name);
    user.setEmail(email);
    return await userRepository.updateUser(userId, { name, email });
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};