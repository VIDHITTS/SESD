import { model, Schema } from "mongoose";
import {
    IBorrowRecordDocument,
    IBorrowRecordModel,
} from "../interfaces/borrow.interface";

const borrowRecordSchema = new Schema<IBorrowRecordDocument>(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        member: {
            type: Schema.Types.ObjectId,
            ref: "Member",
            required: true,
        },
        borrowDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        returnDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["borrowed", "returned", "overdue"],
            default: "borrowed",
        },
        fine: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const BorrowRecordModel = model<IBorrowRecordDocument, IBorrowRecordModel>(
    "BorrowRecord",
    borrowRecordSchema
);

export default BorrowRecordModel;
