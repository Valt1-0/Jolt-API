const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const controller = require("../controllers/FavoriteAddressController");

router.post("/", authenticateToken, controller.addFavorite);
router.get("/", authenticateToken, controller.getFavorites);
router.delete("/:id", authenticateToken, controller.deleteFavorite);
router.put("/:id", authenticateToken, controller.updateFavorite);
router.patch(
  "/:id/position",
  authenticateToken,
  controller.updateFavoritePosition
);
module.exports = router;
