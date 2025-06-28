const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  verifyUser,
  verifyEmailToken,
  updateVerificationToken,
  deleteUser,
  updateUser,
} = require("../controllers/userController");

const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", getAllUsers);
router.get("/get", getUser); // Get user by ID or email
router.get("/verifyEmail", verifyEmailToken); // Verify email token

router.post("/create", createUser); // Create a new user
router.post("/verify", verifyUser); // Verify user credentials
router.put("/updateVerificationToken", updateVerificationToken); // Update verification token (mail)
router.delete("/delete", authenticateToken, deleteUser);
router.patch("/update", authenticateToken, updateUser);

module.exports = router;
