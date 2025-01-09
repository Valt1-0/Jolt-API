const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/get", getUser);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

module.exports = router;
