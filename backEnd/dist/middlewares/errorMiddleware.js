"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = exports.errorHandler = void 0;
// Define a custom error class (optional, for type safety)
class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = "HttpError";
    }
}
// Error-handling middleware
const errorHandler = (err, req, res, next) => {
    // Extract status code and message
    const status = err instanceof HttpError ? err.status : 500;
    const message = err.message || "Internal Server Error";
    // Log the error (optional, can integrate with Morgan or a custom logger)
    console.error(`[ERROR] ${req.method} ${req.url} - ${status} - ${message}`);
    // Send JSON response to client
    res.status(status).json(Object.assign({ success: false, message }, (process.env.NODE_ENV === "development" && { stack: err.stack })));
};
exports.errorHandler = errorHandler;
// Utility to throw custom errors (optional)
const throwError = (status, message) => {
    throw new HttpError(status, message);
};
exports.throwError = throwError;
