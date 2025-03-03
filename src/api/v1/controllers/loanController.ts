import { Request, Response, NextFunction } from "express";
import * as loanService from "../services/loanService";
import { successResponse, errorResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * @description Get all loans.
 * @route GET /api/v1/loans
 * @returns {Promise<void>}
 */
export const getLoans = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const loans = await loanService.getAllLoans();

    res.status(HTTP_STATUS.OK).json(
      successResponse(loans, "Loans Retrieved")
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @description Create a new loan.
 * @route POST /api/v1/loans
 * @returns {Promise<void>}
 */
export const createLoan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newLoan = await loanService.createLoan(req.body);

    res.status(HTTP_STATUS.CREATED).json(
      successResponse(newLoan, "Loan Created")
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @description Review an existing loan.
 * @route PUT /api/v1/loans/:id/review
 * @returns {Promise<void>}
 */
export const reviewLoan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedLoan = await loanService.reviewLoan(req.params.id);
    if (!updatedLoan) {
      res.status(HTTP_STATUS.NOT_FOUND).json(
        errorResponse("Loan Not Found")
      );
      return;
    }

    res.status(HTTP_STATUS.OK).json(
      successResponse(updatedLoan, "Loan Reviewed") // Updated message for clarity
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @description Approve an existing loan.
 * @route PUT /api/v1/loans/:id/approve
 * @returns {Promise<void>}
 */
export const approveLoan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedLoan = await loanService.approveLoan(req.params.id);
    if (!updatedLoan) {
      res.status(HTTP_STATUS.NOT_FOUND).json(
        errorResponse("Loan Not Found")
      );
      return;
    }

    res.status(HTTP_STATUS.OK).json(
      successResponse(updatedLoan, "Loan Approved")
    );
  } catch (error) {
    next(error);
  }
};