const loginUseCase = require('../../Usecase/Authentication/Login');
const registerUseCase = require('../../Usecase/Authentication/Register');
const logoutUseCase = require('../../Usecase/Authentication/Logout');
const profileUseCase = require('../../Usecase/Authentication/Profile');
const userRepository = require('../Gateway/user');

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const token = await loginUseCase(userRepository)(email, password);
      res.json({ token });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  register: async (req, res) => {
    const { email, password, name } = req.body;
    try {
      const user = await registerUseCase({ email, password, name });
      const presentedUser = authPresenter.presentRegister(user);
      res.status(201).json(presentedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  logout: async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    try {
      const result = await logoutUseCase(token)();
      const presentedResult = authPresenter.presentLogout(result);
      res.json(presentedResult);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};