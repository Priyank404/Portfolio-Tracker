import ApiError from "../utilities/apiError.js";

const globalErrorHandler = (err, req, res, next) => {
  // If the error is created using ApiError class
  if (err instanceof ApiError) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Something went wrong",
      errors: err.errors || [],
    });
  }

  // For unexpected errors (not created by ApiError)
  return res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

export default globalErrorHandler;
