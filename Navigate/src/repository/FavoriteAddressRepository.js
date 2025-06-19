const FavoriteAddress = require("../models/FavoriteAddressModel");

exports.create = (data) => FavoriteAddress.create(data);

exports.findByUser = (userId) => FavoriteAddress.find({ user: userId });

exports.delete = (userId, id) =>
  FavoriteAddress.deleteOne({ _id: id, user: userId });

exports.update = (userId, id, data) =>
  FavoriteAddress.findOneAndUpdate({ _id: id, user: userId }, data, {
    new: true,
  });
