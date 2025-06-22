const FavoriteAddress = require("../models/FavoriteAddressModel");

exports.create = (data) => FavoriteAddress.create(data);

exports.findByUser = (userId) => FavoriteAddress.find({ user: userId });

exports.delete = (userId, id) =>
  FavoriteAddress.deleteOne({ _id: id, user: userId });

exports.update = (userId, id, data) =>
  FavoriteAddress.findOneAndUpdate({ _id: id, user: userId }, data, {
    new: true,
  });
  exports.findById = (id) => FavoriteAddress.findById(id);

  exports.bulkUpdatePositions = (userId, start, end, increment) =>
    FavoriteAddress.updateMany(
      {
        user: userId,
        position: { $gte: start, $lte: end },
      },
      { $inc: { position: increment } }
    );