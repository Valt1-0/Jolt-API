const Navigation = require("../models/NavigateModel");

exports.create = (data) => Navigation.create(data);

exports.findById = (id) => Navigation.findById(id);

exports.findAll = async (filter = {}, page = 1, limit = 10) => {
  const pipeline = [];
console.log("Recherche de navigations avec les filtres :", filter);
  // Si filtre géo
  if (filter.lat && filter.lon && filter.radius) {
    const { lat, lon, radius } = filter;
    const radiusInMeters = parseFloat(radius) * 1000;
    console.log("Recherche dans un rayon de", radiusInMeters, "m autour de", lat, lon);
    pipeline.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(lon), parseFloat(lat)],
        },
        distanceField: "distance", // champ ajouté dans le résultat
        maxDistance: radiusInMeters, // en mètres
        spherical: true,
      },
    });

    // Retire les propriétés pour ne pas les filtrer ensuite
    delete filter.lat;
    delete filter.lon;
    delete filter.radius;
  }

  // Autres filtres éventuels
  if (Object.keys(filter).length > 0) {
    pipeline.push({ $match: filter });
  }

  // Comptage total
  const countPipeline = [...pipeline, { $count: "total" }];

  // Pagination
  pipeline.push(
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  );

  const [results, totalResult] = await Promise.all([
    Navigation.aggregate(pipeline),
    Navigation.aggregate(countPipeline),
  ]);

  const total = totalResult[0] ? totalResult[0].total : 0;

  return { total, navigations: results };
};

exports.findByUserId = (userId, filter = {}, page = 1, limit = 10) =>
  Navigation.find({ owner: userId, ...filter })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

exports.save = (navigation) => navigation.save();

exports.findGroupById = (id) => Navigation.findOne({ _id: id, isGroup: true });

exports.findGroupInRadius = (lat, lon, radius) =>
  Navigation.find({
    isGroup: true,
    "gpxPoints.0": {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(lon), parseFloat(lat)],
          parseFloat(radius) / 6378137,
        ],
      },
    },
  });

exports.delete = (id) => Navigation.findByIdAndDelete(id);

exports.update = (id, data) =>
  Navigation.findByIdAndUpdate(id, data, { new: true, runValidators: true });
