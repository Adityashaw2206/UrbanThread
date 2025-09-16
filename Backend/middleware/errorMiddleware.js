
const errorMiddleware = (err,req,res,next) => {
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    data: err.data || null,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}

export default errorMiddleware
