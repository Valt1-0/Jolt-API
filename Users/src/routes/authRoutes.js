const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationEmail,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verifyEmail/:token", verifyEmail);
router.post("/resendVerificationEmail", resendVerificationEmail);

module.exports = router;
