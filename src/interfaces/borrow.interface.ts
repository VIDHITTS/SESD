import { Document, Model, Types } from "mongoose";

// Base Borrow Record Interface
export interface IBorrowRecord {
    book: Types.ObjectId;
    member: Types.ObjectId;
    borrowDate: Date;
    dueDate: Date;
    returnDate?: Date;
    status: "borrowed" | "returned" | "overdue";
    fine?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Borrow Record Document
export interface IBorrowRecordDocument extends Document, IBorrowRecord { }

// Borrow Record Model Type
export type IBorrowRecordModel = Model<IBorrowRecordDocument>;

// Create Borrow DTO
export interface CreateBorrowDTO {
    bookId: string;
    memberId: string;
    durationDays?: number; // Default 14 days
}

// Return Book DTO
export interface ReturnBookDTO {
    borrowRecordId: string;
}

// Borrow Query Parameters
export interface BorrowQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    memberId?: string;
    bookId?: string;
    status?: "borrowed" | "returned" | "overdue";
}
