export const validate = (validator) => (req, res, next) => {
  const message = validator(req);

  if (message) {
    return res.status(400).json({
      success: false,
      message,
    });
  }

  next();
};
