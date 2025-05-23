const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  verifyUser,
  verifyEmailToken,
  updateVerificationToken,
} = require("../controllers/userController");
 
router.get("/", getAllUsers);
router.get("/get", getUser);
router.post("/create", createUser);
router.post("/verify", verifyUser);
router.get("/verifyEmail", verifyEmailToken);
router.put("/updateVerificationToken", updateVerificationToken); 

module.exports = router;
