/**
 * Standard API Response Builder
 */

export const sendSuccess = (res, data, statusCode = 200, message = "Success") => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (res, message, statusCode = 400, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  });
};

export const sendValidationError = (res, errors) => {
  return res.status(422).json({
    success: false,
    message: "Validation error",
    errors,
    timestamp: new Date().toISOString(),
  });
};
