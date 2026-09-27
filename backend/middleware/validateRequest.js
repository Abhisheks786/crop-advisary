const { validationResult } = require('express-validator');

const validateRequest = (rules) => {
  return async (req, res, next) => {
    await Promise.all(rules.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

module.exports = validateRequest;
