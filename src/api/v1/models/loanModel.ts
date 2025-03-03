/**
 * @interface Loan
 * @description Represents a loan object.
 */

export interface Loan {
    id?: string;              // Optional ID (Firestore will generate if not provided)
    appliant: string;        // Name or ID of the loan applicant
    amount: number;          // Loan amount in currency
    status: 'pending' | 'reviewed' | 'approved' | 'rejected'; // Loan status
  }