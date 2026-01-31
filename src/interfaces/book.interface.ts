import { Document, Model } from "mongoose";

// Base Book Interface
export interface IBook {
    title: string;
    author: string;
    isbn: string;
    category: string;
    publishedYear: number;
    quantity: number;
    availableQuantity: number;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Book Document (extends Mongoose Document)
export interface IBookDocument extends Document, IBook { }

// Book Model Type
export type IBookModel = Model<IBookDocument>;

// Create Book DTO
export interface CreateBookDTO {
    title: string;
    author: string;
    isbn: string;
    category: string;
    publishedYear: number;
    quantity: number;
    description?: string;
}

// Update Book DTO
export interface UpdateBookDTO {
    title?: string;
    author?: string;
    category?: string;
    publishedYear?: number;
    quantity?: number;
    description?: string;
}

// Book Query Parameters for filtering, sorting, pagination
export interface BookQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
    category?: string;
    author?: string;
    available?: boolean;
}
