import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/errors";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { UNKNOWN_ERROR_CODE } from "../../../constants/errorConstants";
import { errorResponse } from "../models/responseModel";

/**
 * Global error handling middleware for an Express application.
 * Catches all errors passed to next() and formats them into a consistent response format.
 *
 * @param err - The error object passed from previous middleware or route handlers
 * @param req - Express request object
 * @param res - Express response object
 * @param _next - Express next function (unused but required for Express error middleware signature)
 *
 * Features:
 * - Handles AppError and its subclasses with their specific status codes and messages
 * - Provides consistent error response format
 * - Logs errors for debugging
 *
 * @example
 * // In your Express app setup after all other middleware and controllers:
 * app.use(errorHandler);
 *
 * // In your route handlers:
 * router.get('/users/:id', async (req, res, next) => {
 *   try {
 *     // ... your logic
 *   } catch (error: unknown) {
 *     if (error instanceof RepositoryError) { // Or any other specific error if needed temporarily
 *       next(error);  // Will be handled as AppError
 *     } else {
 *       next(new ServiceError("User operation failed", "USER_ERROR", 400)); // Still works as ServiceError is an AppError
 *     }
 *   }
 * });
 */
interface ExtendedError extends Error {
	code?: string; // Optional custom error code
	statusCode?: number; // HTTP status code for the error
}

const errorHandler = (
	err: ExtendedError,
	req: Request,
	res: Response,
	_next: NextFunction
): void => {
	let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let code: string = UNKNOWN_ERROR_CODE;
    let message: string = "An unexpected error occurred. Please try again.";
	
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        code = err.code;
        message = err.message;
    } else {
        if (typeof err.statusCode === "number") {
            statusCode = err.statusCode;
        }
        if (typeof err.code === "string") {
            code = err.code;
        }
        if (typeof err.message === "string") {
            message = err.message;
        }
    }

    res.status(statusCode).json(errorResponse(message, code));
};

export default errorHandler;