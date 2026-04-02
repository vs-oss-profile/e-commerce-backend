const notFoundRoute = (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
};

module.exports = notFoundRoute;
