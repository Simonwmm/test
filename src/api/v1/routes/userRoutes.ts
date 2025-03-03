import express, { Router } from "express";
import { getUserProfile, deleteUser } from "../controllers/userController";
import { authenticate } from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

/** Route to get the user's profile. */
router.get("/profile", authenticate, getUserProfile);

/** Route to delete a user (students to implement authorization). */
router.delete("/:id", authenticate, isAuthorized({ hasRole: ["admin"] }), deleteUser);

export default router;