const NavigateRepository = require("../repository/NavigateRepository");

exports.createNavigation = async (userId, data) => {
  const firstPoint =
    data.gpxPoints && data.gpxPoints.length > 0 ? data.gpxPoints[0] : null;

  const navigationData = {
    ...data,
    owner: userId,
  };

  if (firstPoint && firstPoint.lon != null && firstPoint.lat != null) {
    navigationData.startLocation = {
      type: "Point",
      coordinates: [firstPoint.lon, firstPoint.lat],
    };
  } else {
    // Soit tu ne mets pas startLocation, soit tu mets coordinates: []
    navigationData.startLocation = undefined;
  }

  return await NavigateRepository.create(navigationData);
};

exports.deleteNavigation = async (userId, id) => {
  const navigation = await NavigateRepository.findById(id);
  if (!navigation) return { error: "Not found", status: 404 };
  if (navigation.owner.toString() !== userId)
    return { error: "Forbidden", status: 403 };
  await NavigateRepository.delete(id);
  return { message: "Navigation deleted successfully" };
};

exports.updateVisibility = async (userId, id) => {
  const navigation = await NavigateRepository.findById(id);
  if (!navigation) return { error: "Not found", status: 404 };
  if (navigation.owner.toString() !== userId)
    return { error: "Forbidden", status: 403 };
  navigation.isPublic = !navigation.isPublic;
  await NavigateRepository.save(navigation);
  return navigation;
};

exports.rateNavigation = async (userId, id, rating) => {
  const navigation = await NavigateRepository.findById(id);
  if (!navigation || !navigation.isPublic)
    return { error: "Not found or not public", status: 404 };
  navigation.notes.push({ user: userId, rating });
  await NavigateRepository.save(navigation);
  return navigation;
};

exports.createGroupNavigation = async (userId, data) => {
  return await NavigateRepository.create({
    ...data,
    owner: userId,
    isGroup: true,
    groupMembers: [userId],
  });
};

exports.joinGroupNavigation = async (userId, id) => {
  const navigation = await NavigateRepository.findGroupById(id);
  if (!navigation) return { error: "Not found or not group", status: 404 };
  if (!navigation.groupMembers.includes(userId)) {
    navigation.groupMembers.push(userId);
    await NavigateRepository.save(navigation);
  }
  return navigation;
};

exports.searchNavigations = async (lat, lon, radius = 5000) => {
  return await NavigateRepository.findGroupInRadius(lat, lon, radius);
};

exports.getAllNavigations = async (userId, role, page, limit, filter = {}) => {
  // Filtre géographique si lat/lon/radius présents
  

  // Exclure les navigations de l'utilisateur courant si demandé
  if (filter.excludeSelf) {
    if (userId) {
      filter.owner = { $ne: userId };
    }
    delete filter.excludeSelf;
  }

  // Si pas connecté (userId absent), on ne retourne que les navigations publiques
  if (!userId) {
    filter.isPublic = true;
    return await NavigateRepository.findAll(filter, page, limit);
  }

  // Si admin
  if (role === "admin") {
    return await NavigateRepository.findAll(filter, page, limit);
  }

  // Utilisateur connecté non admin
  if (!filter.owner) {
    filter.owner = userId;
  } else if (filter.owner !== userId && !filter.isPublic) {
    filter.isPublic = true;
  }

  return await NavigateRepository.findAll(filter, page, limit);
};

exports.getNavigationById = async (id, userId, role) => {
  const navigation = await NavigateRepository.findById(id);
  if (!navigation) return { error: "Not found", status: 404 };

  // Si l'utilisateur n'est pas connecté, on ne retourne que les navigations publiques
  if (!userId && !navigation.isPublic) {
    return { error: "Forbidden", status: 403 };
  }

  // Si l'utilisateur est connecté mais n'est pas le propriétaire et n'est pas admin
  if (userId && navigation.owner.toString() !== userId && role !== "admin") {
    if (!navigation.isPublic) {
      return { error: "Forbidden", status: 403 };
    }
  }
  const isOwner = userId && navigation.owner.toString() === userId;

  return {
    ...navigation.toObject(),
    isOwner,
  };
};

exports.updateNavigation = async (userId, id, data) => {
  const navigation = await NavigateRepository.findById(id);
  if (!navigation) return { error: "Not found", status: 404 };
  console.log(navigation.owner.toString(), userId);

  if (navigation.owner.toString() !== userId)
    return { error: "Forbidden", status: 403 };

  Object.keys(data).forEach((key) => {
    if (key !== "owner" && key !== "_id") {
      navigation[key] = data[key];
    }
  });

  await NavigateRepository.save(navigation);

  return navigation;
};
