const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  verifyUser,
  verifyEmailToken,
  updateVerificationToken,
  deleteUser
} = require("../controllers/userController");

const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", getAllUsers);
router.get("/get", getUser);
router.get("/verifyEmail", verifyEmailToken);

router.post("/create", createUser);
router.post("/verify", verifyUser);
router.put("/updateVerificationToken", updateVerificationToken); 
router.delete("/delete",authenticateToken, deleteUser);

module.exports = router;
