const transporter = require("../utils/transporter");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config();

const loadTemplate = async (templateName) => {
  const templatePath = path.join(
    __dirname,
    "../templates",
    `${templateName}.html`
  );
  return await fs.readFile(templatePath, "utf-8");
};

exports.sendRegisterConfirmationMail = async (data) => {
  const { to, username, verificationToken } = data;
  try {
    // Charger le template
    let htmlContent = await loadTemplate("registerConfirmation");

    // Remplacer les variables dans le template
    htmlContent = htmlContent
      .replace("{{username}}", username)
      .replace(
        "{{confirmationLink}}",
        `http://localhost:8000/verifyEmail?token=${verificationToken}`
      );

    const mailOptions = {
      from: process.env.IONOS_EMAIL,
      to,
      subject: "Confirmation d'inscription",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error.message);
  }
};

exports.sendMail = async (req, res) => {
  const { to, subject, htmlContent } = req.body;

  try {
    const mailOptions = {
      from: process.env.IONOS_EMAIL, // adresse IONOS
      to, // Destinataire
      subject, // Sujet de l'e-mail
      html: htmlContent, // Contenu HTML de l'e-mail
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Email sent successfully", info });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res
      .status(500)
      .send({ message: "Error sending email", error: error.message });
  }
};
