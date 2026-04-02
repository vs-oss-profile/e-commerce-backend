function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
      file: req.file,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: result.error.issues.map((e) => {
          return { field: e.path.join("."), message: e.message };
        }),
      });
    }

    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;
    req.file = result.data.file;

    next();
  };
}

module.exports = validate;
