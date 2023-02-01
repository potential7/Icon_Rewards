const express = require('express');
const userController = require('../controllers/user')
const rewardController = require("../controllers/reward")
const authController = require("../controllers/auth")

const router = express.Router();

router.get('/', userController.dashboard)
router.get('/profile', userController.profileView)
router.post('/profile', userController.profile)
router.get('/rewards', rewardController.viewAllUserRewards)
router.get('/rewards/:id', rewardController.viewProduct)
router.get('/changepassword', authController.changePasswordView)
router.post('/changepassword', authController.changePassword)



module.exports = router;