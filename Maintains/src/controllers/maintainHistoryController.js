const {
  ValidationError,
  NotFoundError,
  OkSuccess,
  CreatedSuccess,
} = require("../utils");
const fs = require("fs");
const path = require("path");
const maintainHistoryService = require("../services/maintainHistoryService");
const mongoose = require("mongoose");
// Create a new maintenance history with files uploads
exports.createMaintainHistory = async (req, res, next) => {
  try {
    const maintainHistoryData = req.body;
    const userId = req.user.id; // Assuming user ID is stored in req.user

    // Handle file uploads
    const files = req.files || [];
    const filePaths = files.map((file) => file.path);

    const newMaintainHistory =
      await maintainHistoryService.createMaintainHistory(
        maintainHistoryData,
        userId,
        filePaths
      );

    const successResponse = new CreatedSuccess(
      "Maintenance history created successfully",
      newMaintainHistory
    );

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};
// Get all maintenance histories for a user with optional filtering
exports.getMaintainHistories = async (req, res, next) => {
  try {
    const role = req.user.role;
    let userId = req.user.id;
    const { query } = req.query; // Assuming query is passed in the request
    let filter = {};
    const objectIdFields = ["vehicle", "type", "_id", "user", "vehicleId"];
    const numberFields = ["mileage"]; // Ajoute ici tous tes champs numériques
    //vehiculeId is used to filter by vehicle ID
    if (req.query.vehicleId && role !== "admin") {
      filter.vehicle = new mongoose.Types.ObjectId(req.query.vehicleId);
    }

    if (query) {
      query.split(",").forEach((q) => {
        const [key, value] = q.split(":");
        if (key && value) {
          if (objectIdFields.includes(key)) {
            filter[key] = mongoose.Types.ObjectId.isValid(value)
              ? new mongoose.Types.ObjectId(value)
              : value;
          } else if (numberFields.includes(key)) {
            filter[key] = Number(value);
          } else {
            filter[key] = { $regex: value, $options: "i" };
          }
        }
      });
    }

    // If not admin, can only retrieve their own histories
    if (role !== "admin" && !req.query.vehicleId) {
      throw new ValidationError(
        "You do not have permission to access these histories."
      );
    }

    const maintainHistories = await maintainHistoryService.getMaintainHistories(
      role,
      filter
    );

    const successResponse = new OkSuccess(
      "Maintenance histories retrieved successfully",
      maintainHistories
    );

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Get a specific maintenance history by ID
exports.getMaintainHistoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log("id", id);
    const maintainHistory = await maintainHistoryService.getMaintainHistoryById(
      id,
      userId
    );

    if (!maintainHistory) {
      throw new NotFoundError("Maintenance history not found");
    }

    const successResponse = new OkSuccess(
      "Maintenance history retrieved successfully",
      maintainHistory
    );

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Update a specific maintenance history by ID and not reupload files if already exists
exports.updateMaintainHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const maintainHistoryData = req.body;
    const userId = req.user.id;

    // Handle file uploads
    const files = req.files || [];
    const filePaths = files.map((file) => file.path);

    const updatedMaintainHistory =
      await maintainHistoryService.updateMaintainHistory(
        id,
        maintainHistoryData,
        userId,
        filePaths
      );

    if (!updatedMaintainHistory) {
      throw new NotFoundError("Maintenance history not found");
    }

    const successResponse = new OkSuccess(
      "Maintenance history updated successfully",
      updatedMaintainHistory
    );

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};
// Delete a specific maintenance history by ID and remove associated files
exports.deleteMaintainHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedMaintainHistory =
      await maintainHistoryService.deleteMaintainHistory(id, userId);

    if (!deletedMaintainHistory) {
      throw new NotFoundError("Maintenance history not found");
    }

    // Remove associated files from the filesystem
    if (
      deletedMaintainHistory.files &&
      deletedMaintainHistory.files.length > 0
    ) {
      deletedMaintainHistory.files.forEach((filePath) => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Failed to delete file: ${filePath}`, err);
          }
        });
      });
    }

    const successResponse = new OkSuccess(
      "Maintenance history deleted successfully",
      deletedMaintainHistory
    );

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};
