class ExpressError extends Error {
  constructor(messange, statuscode) {
    super();
    this.message = messange;
    this.statuscode = statuscode;
  }
}

module.exports = ExpressError;
