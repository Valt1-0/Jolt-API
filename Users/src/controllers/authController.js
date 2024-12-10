const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "2d" });
};

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérification de l'unicité
    const userExists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username }],
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message:
          userExists.email === email.toLowerCase()
            ? "Cette adresse email est déjà utilisée"
            : "Ce nom d'utilisateur est déjà pris",
      });
    }

    // Création du jeton de vérification
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Création de l'utilisateur
    const user = await User.create({
      username: username,
      email: email,
      password,
      profilePicture,
      region,
      status: "waiting",
      verificationToken,
    });

    // Envoi de l'email de vérification
    // MICROSERVICE MAIL
    // await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message:
        "Inscription réussie. Veuillez vérifier votre email pour activer votre compte.",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription",
      error: error.message,
    });
  }
};

// // Login User
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (user && (await user.matchPassword(password))) {
//       res.status(200).json({
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(401).json({ message: "Invalid email or password" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
