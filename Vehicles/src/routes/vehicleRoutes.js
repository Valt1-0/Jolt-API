const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");
const { upload } = require("../utils");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, vehicleController.getAllVehicles);
router.post(
  "/:id/favorite",
  authenticateToken,
  vehicleController.setFavoriteVehicle
);
router.get("/:id", authenticateToken, vehicleController.getVehicleById);
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  vehicleController.createVehicle
);
router.put(
  "/:id/updateMileage",
  authenticateToken,
  vehicleController.updateVehicleMileage
);

router.patch(
  "/:id",
  authenticateToken,
  upload.single("image"),
  vehicleController.updateVehicle
);
router.delete("/:id", authenticateToken, vehicleController.deleteVehicle);

module.exports = router;
