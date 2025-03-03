// External library imports
import { Request, Response, NextFunction } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { AuthenticationError } from "../errors/errors";
import { getErrorMessage, getErrorCode } from "../utils/errorUtils";

// Internal module imports
import { auth } from "../../../../config/firebaseConfig";

/**
 * Middleware to authenticate a user using a Firebase ID token.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const token: string | undefined = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return next(
            new AuthenticationError("Unauthorized: No token provided", "TOKEN_NOT_FOUND")
        );
    }

    try {
        const decodedToken: DecodedIdToken = await auth.verifyIdToken(token);
        res.locals.uid = decodedToken.uid;
        res.locals.role = decodedToken.role;
        console.log(`Authenticated user: UID=${res.locals.uid}, Role=${res.locals.role}`);
        next();
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "code" in error) {
            const firebaseErrorCode = (error as any).code;
            if (firebaseErrorCode === "auth/id-token-expired") {
                return next(
                    new AuthenticationError("Unauthorized: Token expired.", "TOKEN_EXPIRED")
                );
            }
            if (firebaseErrorCode === "auth/argument-error") {
                return next(
                    new AuthenticationError("Unauthorized: Invalid token format.", "INVALID_TOKEN")
                );
            }
            if (firebaseErrorCode === "auth/invalid-token") {
                return next(
                    new AuthenticationError("Unauthorized: Invalid token.", "INVALID_TOKEN")
                );
            }
        }
        return next(
            new AuthenticationError(
                `Unauthorized: ${getErrorMessage(error)}`,
                getErrorCode(error)
            )
        );
    }
};

//export default authenticate;
