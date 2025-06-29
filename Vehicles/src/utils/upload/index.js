const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { IMAGE_UPLOAD_PATH } = require("../../config");

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Crée le dossier s'il n'existe pas
    if (!fs.existsSync(IMAGE_UPLOAD_PATH)) {
      fs.mkdirSync(IMAGE_UPLOAD_PATH, { recursive: true });
    }
    cb(null, IMAGE_UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filtre pour accepter uniquement les fichiers image
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("This format is not authorize"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
