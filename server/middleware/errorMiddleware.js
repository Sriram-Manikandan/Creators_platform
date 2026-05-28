const errorHandler = (err, req, res, next) => {
  // Log error for developers
  console.error('Error:', err);

  // Determine the status code. If it's already set to an error code, use it. Otherwise, default to 500.
  let statusCode = res.statusCode;
  if (statusCode === 200) {
    statusCode = 500;
  }

  // Send consistent response to client
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};

export { errorHandler };
