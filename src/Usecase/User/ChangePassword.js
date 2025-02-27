const userRepository = require('../../Repository/UserRepository');
const bcrypt = require('bcrypt');

module.exports = async (userId, oldPassword, newPassword) => {
  try {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.getPassword());
    if (!passwordMatch) {
      throw new Error('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.setPassword(hashedPassword);
    await userRepository.updateUser(userId, user);
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};