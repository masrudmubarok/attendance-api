const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../../config');
const userRepo = require('../../Repository/UserRepository');

module.exports = async (email, password) => {
  try {
    const user = await userRepo.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, config.jwt.secret, { expiresIn: '1h' });
    return token;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};