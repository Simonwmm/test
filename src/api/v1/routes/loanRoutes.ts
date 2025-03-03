/**
 * Loan Routes (loanRoutes.ts)
 *
 * This file defines the routes for loaning in our application.
 * It uses the Express framework for routing and makes calls to the loan controller
 * (loanController.ts) to handle the logic for each route.
 */
import express, { Router } from "express";
import * as loanController from "../controllers/loanController";
import { validateRequest } from "../middleware/validate";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

//express Router insatance created
const router: Router = express.Router();

//app.use("/api/v1/", adminRouter);
// user create loan
router.post("/loans", loanController.createLoan);

// officer review loan
router.put('/loans/:id/review', loanController.reviewLoan);

// officer or manager get all loans
router.get('/loans', loanController.getLoans);

// manager approve loan
router.put('/loans/:id/approve', loanController.approveLoan);

export default router;