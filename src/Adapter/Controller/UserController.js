const getUserUseCase = require('../../Usecase/User/GetUser');
const updateUserUseCase = require('../../Usecase/User/UpdateUser');
const changePasswordUseCase = require('../../Usecase/User/ChangePassword');
const userPresenter = require('../presenters/user');

module.exports = {
  getUser: async (req, res) => {
    const userId = req.user.userId;
    try {
      const user = await getUserUseCase(userId);
      const presenterUser = userPresenter.presentUser(user);
      res.json(presenterUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateUser: async (req, res) => {
    const userId = req.user.userId;
    const { name, email } = req.body;
    try {
      const updatedUser = await updateUserUseCase(userId, { name, email });
      const presenterUser = userPresenter.presentUser(updatedUser);
      res.json(presenterUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  changePassword: async (req, res) => {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;
    try {
      await changePasswordUseCase(userId, oldPassword, newPassword);
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};