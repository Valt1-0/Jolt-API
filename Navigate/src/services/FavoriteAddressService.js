const FavoriteAddressRepository = require("../repository/FavoriteAddressRepository");

exports.addFavorite = async (userId, data) => {
  // Cherche la plus grande position actuelle pour cet utilisateur
  const lastFav = await FavoriteAddressRepository.findByUser(userId)
    .sort({ position: -1 })
    .limit(1);
  const lastPosition = lastFav.length > 0 ? lastFav[0].position : -1;
  // Crée la nouvelle adresse avec position = lastPosition + 1
  return await FavoriteAddressRepository.create({
    ...data,
    user: userId,
    position: lastPosition + 1,
  });
};

exports.getFavorites = async (userId) => {
  return await FavoriteAddressRepository.findByUser(userId).sort({
    position: 1,
  });
};

exports.deleteFavorite = async (userId, id) => {
  return await FavoriteAddressRepository.delete(userId, id);
};

exports.updateFavorite = async (userId, id, data) => {
  return await FavoriteAddressRepository.update(userId, id, data);
};


exports.updateFavoritePosition = async (userId, id, newPosition) => {
  // Récupère le favori à déplacer
  const fav = await FavoriteAddressRepository.findById(id);
  if (!fav || fav.user.toString() !== userId.toString()) {
    throw new Error("Favorite not found or forbidden");
  }
  const oldPosition = fav.position;

  if (oldPosition === newPosition) return fav;

  // Décale les autres favoris
  if (oldPosition < newPosition) {
    // On remonte, on décale ceux entre old+1 et new vers le haut
    await FavoriteAddressRepository.bulkUpdatePositions(
      userId,
      oldPosition + 1,
      newPosition,
      -1
    );
  } else {
    // On descend, on décale ceux entre new et old-1 vers le bas
    await FavoriteAddressRepository.bulkUpdatePositions(
      userId,
      newPosition,
      oldPosition - 1,
      1
    );
  }

  // Met à jour la position du favori
  return await FavoriteAddressRepository.update(userId, id, {
    position: newPosition,
  });
};