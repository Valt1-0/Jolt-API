const Navigation = require("../models/NavigateModel");

exports.create = (data) => Navigation.create(data);

exports.findById = (id) => Navigation.findById(id);

exports.findAll = async (filter = {}, page = 1, limit = 10) => {
  const [total, navigations] = await Promise.all([
    Navigation.countDocuments(filter),
    Navigation.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }),
  ]);
  return { total, navigations };
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
