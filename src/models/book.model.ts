import { model, Schema } from "mongoose";
import { IBookDocument, IBookModel } from "../interfaces/book.interface";

const bookSchema = new Schema<IBookDocument>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        isbn: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        publishedYear: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        availableQuantity: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

bookSchema.index({ title: "text", author: "text", category: "text" });

const BookModel = model<IBookDocument, IBookModel>("Book", bookSchema);

export default BookModel;
