const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');


router.post('/getToken', authController.getToken);
router.post('/refreshToken', authController.refreshToken);

router.post('/register', authController.registerUser); 
router.post('/logout',authenticateToken, authController.logout);

router.post("/resendVerificationEmail", authController.resendVerificationEmail);

module.exports = router;