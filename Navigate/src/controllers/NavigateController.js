const Navigation = require("../models/NavigateModel");

// Enregistrer un trajet
exports.createNavigation = async (req, res, next) => {
  try {
    const {
      name,
      isPublic,
      gpxPoints,
      startTime,
      endTime,
      altitude,
      totalDistance,
      speedMax,
    } = req.body;
    const navigation = await Navigation.create({
      owner: req.user.id,
      name,
      isPublic,
      gpxPoints,
      startTime,
      endTime,
      altitude,
      totalDistance,
      speedMax,
    });
    res.status(201).json(navigation);
  } catch (err) {
    next(err);
  }
};

// Rendre public/privé
exports.updateVisibility = async (req, res, next) => {
  try {
    const navigation = await Navigation.findById(req.params.id);
    if (!navigation) return res.status(404).json({ error: "Not found" });
    if (navigation.owner.toString() !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });
    navigation.isPublic = !navigation.isPublic;
    await navigation.save();
    res.json(navigation);
  } catch (err) {
    next(err);
  }
};

// Noter un trajet
exports.rateNavigation = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const navigation = await Navigation.findById(req.params.id);
    if (!navigation || !navigation.isPublic)
      return res.status(404).json({ error: "Not found or not public" });
    navigation.notes.push({ user: req.user.id, rating });
    await navigation.save();
    res.json(navigation);
  } catch (err) {
    next(err);
  }
};

// Créer un trajet de groupe
exports.createGroupNavigation = async (req, res, next) => {
  try {
    const { name, gpxPoints, startTime, totalDistance } = req.body;
    const navigation = await Navigation.create({
      owner: req.user.id,
      name,
      isGroup: true,
      groupMembers: [req.user.id],
      gpxPoints,
      startTime,
      totalDistance,
    });
    res.status(201).json(navigation);
  } catch (err) {
    next(err);
  }
};

// Rejoindre un trajet de groupe
exports.joinGroupNavigation = async (req, res, next) => {
  try {
    const navigation = await Navigation.findById(req.params.id);
    if (!navigation || !navigation.isGroup)
      return res.status(404).json({ error: "Not found or not group" });
    if (!navigation.groupMembers.includes(req.user.id)) {
      navigation.groupMembers.push(req.user.id);
      await navigation.save();
    }
    res.json(navigation);
  } catch (err) {
    next(err);
  }
};

// Chercher des trajets de groupe dans un rayon
exports.searchNavigations = async (req, res, next) => {
  try {
    const { lat, lon, radius = 5000 } = req.query; // rayon en mètres
    // Pour simplifier, on prend le premier point du GPX comme référence
    const navigations = await Navigation.find({
      isGroup: true,
      "gpxPoints.0": {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lon), parseFloat(lat)],
            parseFloat(radius) / 6378137, // rayon en radians
          ],
        },
      },
    });
    res.json(navigations);
  } catch (err) {
    next(err);
  }
};
