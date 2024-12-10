const express = require("express");
const router = express.Router();
const { sendMail, sendRegisterConfirmationMail } = require("../controller/mailController");

router.post("/send", sendRegisterConfirmationMail);


module.exports = router;
