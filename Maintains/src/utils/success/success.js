const { STATUS_CODES } = require("./statusCodes");

class Success {
  constructor(name, status, description, data) {
    this.name = name;
    this.success = true;
    this.message = description;
    this.data = data;
    this.statusCode = status;
  }
  toJSON() {
    return {
      success: this.success,
      message: this.message,
      data: this.data,
    };
  }
}

class CreatedSuccess extends Success {
  constructor(description = "Created", data = {}) {
    super("Created", STATUS_CODES.CREATED, description, data);
  }
}

class OkSuccess extends Success {
  constructor(description = "Ok", data = {}) {
    super("Ok", STATUS_CODES.OK, description, data);
  }
}

module.exports = {
  Success,
  CreatedSuccess,
  OkSuccess,
};
