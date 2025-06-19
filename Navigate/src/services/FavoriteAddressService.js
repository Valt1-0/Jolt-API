const FavoriteAddressRepository = require("../repository/FavoriteAddressRepository");

exports.addFavorite = async (userId, data) => {
  return await FavoriteAddressRepository.create({ ...data, user: userId });
};

exports.getFavorites = async (userId) => {
  return await FavoriteAddressRepository.findByUser(userId);
};

exports.deleteFavorite = async (userId, id) => {
  return await FavoriteAddressRepository.delete(userId, id);
};

exports.updateFavorite = async (userId, id, data) => {
  return await FavoriteAddressRepository.update(userId, id, data);
};
