const express = require("express");
const router = express.Router();

const pushTokenController = require("../controller/pushTokenController");


router.post("/push-token", pushTokenController.registerPushToken);
router.post("/send-push", pushTokenController.sendPushToUser);

module.exports = router;
