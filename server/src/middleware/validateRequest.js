const validateFields = requiredFields => (req, res, next) => {
  const missingFields = requiredFields.filter(field => {
    const value = (req.body && req.body[field]) ?? (req.params && req.params[field]) ?? (req.query && req.query[field]);

    return value === undefined || value === null;
  });

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  next();
};

export { validateFields };
