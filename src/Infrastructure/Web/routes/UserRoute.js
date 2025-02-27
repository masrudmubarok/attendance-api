const express = require('express');
const router = express.Router();
const userController = require('../../../Adapter/Controller/UserController');
const authMiddleware = require('../middleware/AuthenticationMiddleware');

router.get('/user', authMiddleware, userController.getProfile);
router.put('/user', authMiddleware, userController.updateProfile);
router.put('/user/change-password', authMiddleware, userController.changePassword);

module.exports = router;