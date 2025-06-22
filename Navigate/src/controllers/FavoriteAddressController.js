const { OkSuccess, CreatedSuccess } = require("../utils");
const FavoriteAddressService = require("../services/FavoriteAddressService");

exports.addFavorite = async (req, res, next) => {
  try {
    const fav = await FavoriteAddressService.addFavorite(req.user.id, req.body);
    const successResponse = new CreatedSuccess("Favorite address added", fav);
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.getFavorites = async (req, res, next) => {
  try {
    const favs = await FavoriteAddressService.getFavorites(req.user.id);
    const successResponse = new OkSuccess("Favorite addresses", favs);
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.deleteFavorite = async (req, res, next) => {
  try {
    await FavoriteAddressService.deleteFavorite(req.user.id, req.params.id);
    const successResponse = new OkSuccess("Favorite address deleted");
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.updateFavorite = async (req, res, next) => {
  try {
    const fav = await FavoriteAddressService.updateFavorite(
      req.user.id,
      req.params.id,
      req.body
    );
    const successResponse = new OkSuccess("Favorite address updated", fav);
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.updateFavoritePosition = async (req, res, next) => {
  try {
    const fav = await FavoriteAddressService.updateFavoritePosition(
      req.user.id,
      req.params.id,
      req.body.position
    );
    res.json(fav);
  } catch (err) {
    next(err);
  }
};
