const apiError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

module.exports = apiError;
