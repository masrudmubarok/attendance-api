const userRepository = require('../../Repository/UserRepository');

module.exports = async ({ email, password, name }) => {
  try {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exist');
    }

    const newUser = await userRepository.createUser({ email, password, name });
    return newUser;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};