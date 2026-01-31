import { Document, Model } from "mongoose";

// Base Member Interface
export interface IMember {
    name: string;
    email: string;
    password: string;
    phone: string;
    address?: string;
    membershipType: "basic" | "premium" | "student";
    isActive: boolean;
    borrowedBooks: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

// Member Document (extends Mongoose Document)
export interface IMemberDocument extends Document, IMember {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Member Model Type
export type IMemberModel = Model<IMemberDocument>;

// Create Member DTO (Registration)
export interface CreateMemberDTO {
    name: string;
    email: string;
    password: string;
    phone: string;
    address?: string;
    membershipType?: "basic" | "premium" | "student";
}

// Update Member DTO
export interface UpdateMemberDTO {
    name?: string;
    phone?: string;
    address?: string;
    membershipType?: "basic" | "premium" | "student";
}

// Login DTO
export interface LoginDTO {
    email: string;
    password: string;
}

// Member Query Parameters
export interface MemberQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
    membershipType?: string;
    isActive?: boolean;
}

// Auth Response
export interface AuthResponse {
    member: Partial<IMember>;
    token: string;
}
