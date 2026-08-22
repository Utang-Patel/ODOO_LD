// Global Express Error Middleware
export const errorHandler = (err, req, res, next) => {
  console.error('[API Error]:', err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Mask database credentials or raw SQL in production responses
  let message = err.message || 'Internal Server Error';

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Record with matching information already exists.'
    });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: err.errors ? err.errors.map(e => e.message).join(', ') : 'Validation error'
    });
  }

  return res.status(statusCode).json({
    success: false,
    message
  });
};

export const notFoundHandler = (req, res, next) => {
  return res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
};
