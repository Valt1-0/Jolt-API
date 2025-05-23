const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');


router.post('/getToken', authController.getToken);
router.post('/refreshToken', authController.refreshToken);

router.post('/register', authController.registerUser); 

module.exports = router;