const {
  ValidationError,
  NotFoundError,
  OkSuccess,
  CreatedSuccess,
} = require("../utils");
const NavigateService = require("../services/NavigateService");
const e = require("express");

exports.createNavigation = async (req, res, next) => {
  try {
    const navigation = await NavigateService.createNavigation(
      req.user.id,
      req.body
    );
    const successResponse = new CreatedSuccess(
      "Navigation created successfully",
      navigation
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.updateVisibility = async (req, res, next) => {
  try {
    const result = await NavigateService.updateVisibility(
      req.user.id,
      req.params.id
    );
    if (result.error)
      return res.status(result.status).json({ error: result.error });
    const successResponse = new OkSuccess(
      "Navigation visibility updated",
      result
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.rateNavigation = async (req, res, next) => {
  try {
    const result = await NavigateService.rateNavigation(
      req.user.id,
      req.params.id,
      req.body.rating
    );
    if (result.error)
      return res.status(result.status).json({ error: result.error });
    const successResponse = new OkSuccess(
      "Navigation rated successfully",
      result
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (err) {
    console.error("Error in rateNavigation:", err);
    next(err);
  }
};

exports.createGroupFromExisting = async (req, res, next) => {
  try {
    const original = await NavigateService.getNavigationById(
      req.params.id,
      req.user.id,
      req.user.role
    );
    if (!original || original.error)
      return res.status(404).json({ error: "Trajet original introuvable" });

    // On duplique les données utiles
    const groupData = {
      ...original,
      _id: undefined,
      owner: req.user.id,
      isGroup: true,
      groupMembers: [req.user.id],
      startTime: req.body.startTime || undefined, // Permet de reprogrammer
      createdAt: undefined,
      notes: [],
    };

    const groupNav = await NavigateService.createGroupNavigation(
      req.user.id,
      groupData
    );
    return res.status(201).json(groupNav);
  } catch (err) {
    next(err);
  }
};

exports.createGroupNavigation = async (req, res, next) => {
  try {
    const navigation = await NavigateService.createGroupNavigation(
      req.user.id,
      req.body
    );
    const successResponse = new CreatedSuccess(
      "Group navigation created successfully",
      navigation
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.joinGroupNavigation = async (req, res, next) => {
  try {
    const result = await NavigateService.joinGroupNavigation(
      req.user.id,
      req.params.id
    );
    if (result.error)
      return res.status(result.status).json({ error: result.error });
    const successResponse = new OkSuccess(
      "Joined group navigation successfully",
      result
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.searchNavigations = async (req, res, next) => {
  try {
    const { lat, lon, radius } = req.query;
    const navigations = await NavigateService.searchNavigations(
      lat,
      lon,
      radius
    );
    const successResponse = new OkSuccess(
      "Navigations retrieved successfully",
      navigations
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (err) {
    next(err);
  }
};

// Get all navigations for the authenticated user and filter by count, date, or visibility
exports.getAllNavigation = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, ...filter } = req.query;

    // if (date) filter.date = new Date(date);
    // if (visibility) filter.visibility = visibility === "true";

    const navigations = await NavigateService.getAllNavigations(
      req.user?.id,
      req.user?.role,
      parseInt(page),
      parseInt(limit),
      filter
    );

    const successResponse = new OkSuccess(
      "Navigations retrieved successfully",
      navigations
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.getNavigationById = async (req, res, next) => {
  try {
    const navigation = await NavigateService.getNavigationById(
      req.params.id,
      req.user?.id,
      req.user?.role
    );

    if (!navigation) {
      throw new NotFoundError("Navigation not found");
    }

    const successResponse = new OkSuccess(
      "Navigation retrieved successfully",
      navigation
    );

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.deleteNavigation = async (req, res, next) => {
  try {
    const navigation = await NavigateService.deleteNavigation(
      req.user.id,
      req.params.id
    );

    const successResponse = new OkSuccess(
      "Navigation deleted successfully",
      navigation
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.updateNavigation = async (req, res, next) => {
  try {
    const navigation = await NavigateService.updateNavigation(
      req.user.id,
      req.params.id,
      req.body
    );

    if (!navigation) {
      throw new NotFoundError("Navigation not found");
    }

    const successResponse = new OkSuccess(
      "Navigation updated successfully",
      navigation
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (err) {
    next(err);
  }
};
