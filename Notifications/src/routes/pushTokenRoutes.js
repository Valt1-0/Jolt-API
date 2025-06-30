const express = require("express");
const router = express.Router();

const pushTokenController = require("../controller/pushTokenController");

router.post("/push-token", pushTokenController.registerPushToken);
router.post("/send-push", pushTokenController.sendPushToUser);
router.post("/send-push-many", pushTokenController.sendPushToMany);
router.post("/attach-user", pushTokenController.attachUserToDevice);

module.exports = router;
