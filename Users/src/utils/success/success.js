const { STATUS_CODES } = require("./statusCodes");

class Success {
  constructor(name, status, description, data) {
    this.name = name;
    this.success = true;
    this.message = description;
    this.data = data;
    this.statusCode = status;
  }
}

class CreatedSuccess extends Success {
  constructor(description = "Created", data = {}) {
    super("Created", STATUS_CODES.CREATED, description, data);
  }
}

module.exports = {
  Success,
  CreatedSuccess,
};
