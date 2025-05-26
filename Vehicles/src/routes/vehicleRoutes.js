const express = require("express");
const router = express.Router();
const  vehicleController = require("../controllers/vehicleController");
const {upload} = require("../utils");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/", authenticateToken,upload.single("image"), vehicleController.createVehicle);
router.get("/", authenticateToken, vehicleController.getAllVehicles);
router.get("/:id", authenticateToken, vehicleController.getVehicleById);
router.put("/:id", authenticateToken,upload.single("image"), vehicleController.updateVehicle);
router.delete("/:id", authenticateToken, vehicleController.deleteVehicle);


module.exports = router;