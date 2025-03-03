import { Request, Response, NextFunction } from "express";
import { auth } from "../../../../config/firebaseConfig";

/**
 * Controller to get the user profile.
 * @param req - Incoming request object.
 * @param res - Response object to send the user profile response.
 * @param next - Next middleware function.
 */
export const getUserProfile = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	// You must implement setting `res.locals.uid`
	try {
		const userId: string = res.locals.uid;;
		res.status(200).json({ message: `User profile for user ID: ${userId}` });
}	catch (error) {
		next(error);
	}
}

/**
 * Controller to delete a user (requires admin role).
 * @param req - Incoming request object.
 * @param res - Response object to confirm deletion.
 * @param next - Next middleware function.
 */
export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId: string = req.params.id;
        await auth.deleteUser(userId);
        res.status(200).json({ message: `User ${userId} deleted by admin` });
    } catch (error) {
        next(error);
    }
};