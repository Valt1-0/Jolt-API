const transporter = require("../utils/transporter");
require("dotenv").config();

exports.sendRegisterConfirmationMail = async (req, res) => {
  const { to, subject } = req.body;

  try {
    const mailOptions = {
      from: process.env.IONOS_EMAIL, // Votre adresse IONOS
      to, // Destinataire
      subject, // Sujet de l'e-mail
      html: htmlContent, // Contenu HTML de l'e-mail
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).send({ message: "Email sent successfully", info });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res
      .status(500)
      .send({ message: "Error sending email", error: error.message });
  }
};

exports.sendMail = async (req, res) => {
  const { to, subject, htmlContent } = req.body;

  try {
    const mailOptions = {
      from: process.env.IONOS_EMAIL, // Votre adresse IONOS
      to, // Destinataire
      subject, // Sujet de l'e-mail
      html: htmlContent, // Contenu HTML de l'e-mail
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).send({ message: "Email sent successfully", info });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res
      .status(500)
      .send({ message: "Error sending email", error: error.message });
  }
};

// const sendTestEmail = async () => {
//   await sendMail(
//     "contact@joltz.fr", // Destinataire valide
//     "Test Subject", // Sujet
//     "<h1>This is a test email</h1>" // Contenu HTML
//   );
// };

sendTestEmail().catch(console.error); // Gérer les erreurs ici
