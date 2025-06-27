const mongoose = require("mongoose");
const Navigation = require("./models/NavigateModel"); // adapte le chemin vers ton modèle

mongoose.connect("mongodb://localhost:27017/Jolt"); // adapte l'URL

async function fixStartLocation() {
  const navigations = await Navigation.find({
    "startLocation.coordinates": { $exists: false },
  });
  for (const nav of navigations) {
    if (nav.gpxPoints && nav.gpxPoints.length > 0) {
      nav.startLocation = {
        type: "Point",
        coordinates: [nav.gpxPoints[0].lon, nav.gpxPoints[0].lat],
      };
      await nav.save();
      console.log("Corrigé :", nav._id);
    } else {
      // Si pas de point, retire startLocation
      nav.startLocation = undefined;
      await nav.save();
      console.log("Retiré startLocation :", nav._id);
    }
  }
  console.log("Migration terminée !");
  process.exit();
}
fixStartLocation();
