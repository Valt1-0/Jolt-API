const express = require("express");
const router = express.Router();
const { upload } = require("../utils");
const { authenticateToken } = require("../middlewares/authMiddleware");

const maintainController = require("../controllers/maintainController");
// Routes for Maintenance Types
router.post("/", authenticateToken, maintainController.createMaintain);
router.get("/", authenticateToken, maintainController.getMaintains);
router.get("/:id", authenticateToken, maintainController.getMaintainById);
router.post("/count", authenticateToken, maintainController.getMaintenanceCount);
router.put("/:id", authenticateToken, maintainController.updateMaintain);
router.delete("/:id", authenticateToken, maintainController.deleteMaintain);

module.exports = router;
