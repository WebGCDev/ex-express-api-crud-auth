class RestError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.customMessage = message;
  }
}

module.exports = RestError;
