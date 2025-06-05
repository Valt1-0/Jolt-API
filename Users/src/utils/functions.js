const sendVerificationEmail = async (email, username, verificationToken) => {
  try {
    const response = await fetch(
      "http://localhost:5001/mail/registerConfirmation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          to: email,
          verificationToken: verificationToken,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send verification email");
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Error sending verification email");
  }
};

module.exports = {
  sendVerificationEmail,
};
