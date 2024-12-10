const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.ionos.fr", // Serveur SMTP d'IONOS
  port: 465, // SSL/TLS
  secure: true, // false pour STARTTLS, true pour SSL/TLS
  auth: {
    user: process.env.IONOS_EMAIL, // Votre adresse e-mail
    pass: process.env.IONOS_PASSWORD, // Votre mot de passe
  },
  tls: {
    rejectUnauthorized: true, // Permet les certificats auto-signés (si besoin)
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("Transporter configuration error:", error);
  } else {
    console.log("Transporter is configured correctly:", success);
  }
});


module.exports = transporter;
