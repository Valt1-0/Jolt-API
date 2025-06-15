const Navigation = require("../models/NavigateModel");

exports.create = (data) => Navigation.create(data);

exports.findById = (id) => Navigation.findById(id);

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
