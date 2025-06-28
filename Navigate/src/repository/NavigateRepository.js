const Navigation = require("../models/NavigateModel");

exports.create = (data) => Navigation.create(data);

exports.findById = (id) => Navigation.findById(id);

exports.findAll = async (filter = {}, page = 1, limit = 10) => {
  const pipeline = [];

  console.log("Recherche de navigations avec les filtres :", filter);

  if (filter.lat && filter.lon && filter.radius) {
    const { lat, lon, radius } = filter;
    const radiusInMeters = parseFloat(radius) * 1000;

    console.log(
      "Recherche dans un rayon de",
      radiusInMeters,
      "m autour de",
      lat,
      lon
    );

    pipeline.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(lon), parseFloat(lat)],
        },
        distanceField: "distance",
        maxDistance: radiusInMeters,
        spherical: true,
      },
    });

    delete filter.lat;
    delete filter.lon;
    delete filter.radius;
  }

  if (Object.keys(filter).length > 0) {
    pipeline.push({ $match: filter });
  }

  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerInfo",
      },
    },
    {
      $unwind: {
        path: "$ownerInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    // Ici on garde tous les champs
    {
      $project: {
        // Inclure tous les champs du document principal
        _id: 1,
        owner: 1,
        name: 1,
        createdAt: 1,
        totalDistance: 1,
        isPublic: 1,
        isGroup: 1,
        note: 1,
        gpxPoints: 1,
        startLocation: 1,
        startTime: 1,
        ownerInfo: {
          _id: 1,
          username: 1,
          email: 1,
          role: 1,
        },
      },
    }
  );

  pipeline.push(
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  );

  const countPipeline = [...pipeline, { $count: "total" }];

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
