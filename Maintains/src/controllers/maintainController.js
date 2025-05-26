const {
  ValidationError,
  NotFoundError,
  OkSuccess,
  CreatedSuccess,
} = require("../utils");
const fs = require("fs");
const path = require("path");
const maintainService = require("../services/maintainService");

// Create a new maintenance
exports.createMaintain = async (req, res, next) => {
  try {
    const maintainData = req.body;
    const userId = req.user.id; // Assuming user ID is stored in req.user

    const newMaintain = await maintainService.createMaintain(
      maintainData,
      userId
    );

    const successResponse = new CreatedSuccess(
      "Maintenance created successfully",
      newMaintain
    );

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Get all maintenances for a user
exports.getMaintains = async (req, res, next) => {
  try {
    const role = req.user.role;
    let userId = req.user.id;
    const { query } = req.query; // Assuming query is passed in the request
    let filter = {};
    // If admin, can filter by userId passed in query
    if (role === "admin") {
      userId = null; // If no userId is provided, retrieve all maintenances
    }

    // if is not admin, can only retrieve their own maintenances
    if (role !== "admin" && !req.query.userId) {
      userId = req.user.id;
    }

    // If member, can only retrieve their own maintenances
    if (
      role !== "admin" &&
      req.query.userId &&
      req.query.userId !== req.user.id
    ) {
      throw new ValidationError(
        "You do not have permission to access these maintenances."
      );
    }
    const stringFields = ["name", "description", "notes"]; // adapte selon ton modèle

    // If query is provided, parse it to filter maintenances
    if (query) {
      const [key, value] = query.split(":");
      if (key && value) {
        if (stringFields.includes(key)) {
          filter[key] = { $regex: value, $options: "i" };
        } else {
          // Pour les autres types (ex: ObjectId, Number), filtre exact
          filter[key] = value;
        }
      }
    }

    // If admin without userId, retrieve all
    const maintains = await maintainService.getMaintains(userId, filter);

    const successResponse = new OkSuccess(
      "Maintenances retrieved successfully",
      maintains
    );

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Get a maintenance by ID
exports.getMaintainById = async (req, res, next) => {
  try {
    const maintainId = req.params.id;
    const userId = req.user.id; // Assuming user ID is stored in req.user
    const role = req.user.role; // Assuming role is stored in req.user

    const maintain = await maintainService.getMaintainById(
      maintainId,
      userId,
      role
    );

    if (!maintain) {
      throw new NotFoundError("Maintenance not found");
    }

    const successResponse = new OkSuccess(
      "Maintenance retrieved successfully",
      maintain
    );

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};
// Update a maintenance by ID
exports.updateMaintain = async (req, res, next) => {
  try {
    const maintainId = req.params.id;
    const maintainData = req.body;
    const userId = req.user.id;

    if (!maintainId)
      throw new ValidationError("Maintenance ID is required for update");
    if (!maintainData || Object.keys(maintainData).length === 0) {
      throw new ValidationError("Maintenance data is required for update");
    }

    const updatedMaintain = await maintainService.updateMaintain(
      maintainId,
      maintainData,
      userId
    );

    const successResponse = new OkSuccess(
      "Maintenance updated successfully",
      updatedMaintain
    );

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};
// Delete a maintenance by ID
exports.deleteMaintain = async (req, res, next) => {
  try {
    const maintainId = req.params.id;
    const userId = req.user.id;

    if (!maintainId) {
      throw new ValidationError("Maintenance ID is required for deletion");
    }

    await maintainService.deleteMaintain(maintainId, userId);

    const successResponse = new OkSuccess("Maintenance deleted successfully");

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};
