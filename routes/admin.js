const express = require('express');
const rewardController = require("../controllers/reward")
const adminController = require("../controllers/admin")
const authMiddlewareA = require('../middleware/authMiddlewareA');

const router = express.Router();


router.get('/changepassword', authMiddlewareA, adminController.changePasswordView)
router.post('/changepassword', authMiddlewareA, adminController.changePassword)
router.get('/get-users', authMiddlewareA, adminController.getAllUsers)
router.post('/delete-user', authMiddlewareA, adminController.deleteUser)
router.get('/grant-reward', authMiddlewareA, rewardController.grantRewardView)
router.post('/grant-reward', authMiddlewareA, rewardController.grantReward)
router.post('/delete-reward', authMiddlewareA, rewardController.deleteReward)
router.get('/view-reward', authMiddlewareA, rewardController.viewAllRewards)
router.get('/dashboard', authMiddlewareA, adminController.dashboard)
router.get('/add-product', authMiddlewareA, adminController.addProduct)
router.post('/add-product/:id', authMiddlewareA, rewardController.addProduct)
router.get('/view-product/:id', authMiddlewareA, rewardController.viewAllProduct)

router.get('/logout', authMiddlewareA, (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin')
    })
})



module.exports = router;