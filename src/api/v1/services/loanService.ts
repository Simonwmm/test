/**
 * Loan Service (LoanService.ts)
 *
 * This file defines functions (services) for managing Loan data. These functions
 * currently store Loans in-memory but could be extended to use a database.
 */
import { Loan } from "../models/loanModel";
import {
    getDocuments,
    createDocument,
    updateDocument,
    getDocumentById,
} from "../repositories/firestoreRepository";

const COLLECTION = "Loans";

/**
 * @description Get all Loans.
 * @returns {Promise<Loan[]>}
 */
export const getAllLoans = async (): Promise<Loan[]> => {
    const snapshot: FirebaseFirestore.QuerySnapshot = await getDocuments(
        COLLECTION
    );

    return snapshot.docs.map((doc) => {
        const data: FirebaseFirestore.DocumentData = doc.data();
        return { id: doc.id, ...data } as Loan;
    });
};

/**
 * @description Create a new Loan.
 * @param {Partial<Loan>} Loan - The Loan data.
 * @returns {Promise<Loan>}
 * @throws {Error} If the loan data is invalid.
 */
export const createLoan = async (loan: Partial<Loan>): Promise<Loan> => {
    const { applicant, amount, id } = loan as { applicant?: string; amount?: number; id?: string };

    if (!applicant || amount === undefined || amount <= 0) {
        throw new Error("Invalid loan application data: applicant and amount (positive number) are required");
    }
    const dataWithDefaults: Partial<Loan> = {
        ...loan,
        status: "pending", 
    };

    let docId: string;

    if (id) {
        docId = id;
        await createDocument(COLLECTION, dataWithDefaults, docId);
    } else {
        docId = await createDocument(COLLECTION, dataWithDefaults);
    }

    return { id: docId, ...dataWithDefaults } as Loan;
};

  /**
  * @description Review an existing loan by updating its status to 'reviewed'.
  * @param {string} id - The ID of the loan to review.
  * @returns {Promise<Loan>}
  * @throws {Error} If the loan is not found or already processed.
  */
 export const reviewLoan = async (id: string): Promise<Loan> => {
   const loanDoc = await getDocumentById(COLLECTION, id);
   const loanData = loanDoc.data() as Loan;
 
   if (!loanDoc.exists) {
     throw new Error(`Loan with ID ${id} not found`);
   }
 
   if (loanData.status !== "pending") {
     throw new Error("Loan cannot be reviewed (already processed)");
   }
 
   await updateDocument(COLLECTION, id, { status: "reviewed" });
   return { id, ...loanData, status: "reviewed" } as Loan;
 };

/**
 * @description Approve an existing loan by updating its status to 'approved'.
 * @param {string} id - The ID of the loan to approve.
 * @returns {Promise<Loan>}
 * @throws {Error} If the loan is not found or not reviewed yet.
 */
export const approveLoan = async (id: string): Promise<Loan> => {
  const loanDoc = await getDocumentById(COLLECTION, id);
  const loanData = loanDoc.data() as Loan;

  if (!loanDoc.exists) {
    throw new Error(`Loan with ID ${id} not found`);
  }

  if (loanData.status !== "reviewed") {
    throw new Error("Loan cannot be approved (not reviewed yet)");
  }

  await updateDocument(COLLECTION, id, { status: "approved" });
  return { id, ...loanData, status: "approved" } as Loan;
};