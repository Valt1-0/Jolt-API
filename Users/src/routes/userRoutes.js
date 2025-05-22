const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  verifyUser,
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/get", getUser);
router.post("/create", createUser);
router.post("/verify", verifyUser);

module.exports = router;
