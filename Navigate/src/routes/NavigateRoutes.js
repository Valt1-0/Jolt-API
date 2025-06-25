const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  optionalAuthenticateToken,
} = require("../middlewares/authMiddleware");
const navigationController = require("../controllers/NavigateController");

// Enregistrer un trajet (privé ou public)
router.post("/", authenticateToken, navigationController.createNavigation);

// Rendre un trajet public/privé
router.patch(
  "/:id/visibility",
  authenticateToken,
  navigationController.updateVisibility
);

// Noter un trajet public
router.post(
  "/:id/rate",
  authenticateToken,
  navigationController.rateNavigation
);

// Créer un trajet de groupe
router.post(
  "/group",
  authenticateToken,
  navigationController.createGroupNavigation
);

// Rejoindre un trajet de groupe
router.post(
  "/group/:id/join",
  authenticateToken,
  navigationController.joinGroupNavigation
);

// // Suivi temps réel (socket, pas REST mais pour info)
// router.get(
//   "/group/:id/live",
//   authenticateToken,
//   navigationController.getGroupLiveInfo
// );

// Lister les trajets publics ou de groupe dans un rayon
router.get(
  "/search",
  authenticateToken,
  navigationController.searchNavigations
);

router.get(
  "/",
  optionalAuthenticateToken,
  navigationController.getAllNavigation
);
router.get(
  "/:id",
  optionalAuthenticateToken,
  navigationController.getNavigationById
);

router.delete(
  "/:id",
  authenticateToken,
  navigationController.deleteNavigation
);

module.exports = router;
