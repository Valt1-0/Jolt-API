const express = require("express");
const router = express.Router();
const { upload } = require("../utils");
const { authenticateToken } = require("../middlewares/authMiddleware");

const maintainHistoryController = require("../controllers/maintainHistoryController");

// Routes for Maintenance History
router.post(
  "/",
  authenticateToken,
  upload.fields([{ name: "files", maxCount: 10 }]),
  maintainHistoryController.createMaintainHistory
);
router.get(
  "/",
  authenticateToken,
  maintainHistoryController.getMaintainHistories
);
router.get(
  "/:id",
  authenticateToken,
  maintainHistoryController.getMaintainHistoryById
);
router.put(
  "/:id",
  authenticateToken,
  maintainHistoryController.updateMaintainHistory
);
router.delete(
  "/:id",
  authenticateToken,
  maintainHistoryController.deleteMaintainHistory
);

module.exports = router;
