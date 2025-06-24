const NavigateRepository = require("../repository/NavigateRepository");

exports.createNavigation = async (userId, data) => {
  return await NavigateRepository.create({ ...data, owner: userId });
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
  if (role === "admin" && filter.userId !== userId) {
    // Admin if no userId is provided, get all navigations
    const { total, navigations } = await NavigateRepository.findAll(
      filter,
      page,
      limit
    );
    return { total, navigations };
  }
  // Otherwise, get navigations for a given userId
  return await NavigateRepository.findByUserId(userId, filter, page, limit);
};
