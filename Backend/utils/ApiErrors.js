class ApiError extends Error {
  constructor(
    // message, 
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "",
    data,
) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.errors = errors;
    if(stack){
        this.stack = stack;
    }else{
        Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;