import BorrowRecordModel from "../models/borrow.model";
import BookModel from "../models/book.model";
import MemberModel from "../models/member.model";
import {
    IBorrowRecordDocument,
    CreateBorrowDTO,
    BorrowQueryParams,
} from "../interfaces/borrow.interface";

class BorrowService {
    public async borrowBook(data: CreateBorrowDTO): Promise<IBorrowRecordDocument> {
        const { bookId, memberId, durationDays = 14 } = data;

        const book = await BookModel.findById(bookId);
        if (!book) {
            throw new Error("Book not found");
        }

        if (book.availableQuantity <= 0) {
            throw new Error("Book is not available");
        }

        const member = await MemberModel.findById(memberId);
        if (!member) {
            throw new Error("Member not found");
        }

        if (!member.isActive) {
            throw new Error("Member account is deactivated");
        }

        const borrowDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + durationDays);

        const borrowRecord = await BorrowRecordModel.create({
            book: bookId,
            member: memberId,
            borrowDate,
            dueDate,
            status: "borrowed",
        });

        await BookModel.findByIdAndUpdate(bookId, {
            $inc: { availableQuantity: -1 },
        });

        await MemberModel.findByIdAndUpdate(memberId, {
            $push: { borrowedBooks: bookId },
        });

        return borrowRecord;
    }

    public async returnBook(borrowRecordId: string): Promise<IBorrowRecordDocument> {
        const record = await BorrowRecordModel.findById(borrowRecordId);
        if (!record) {
            throw new Error("Borrow record not found");
        }

        if (record.status === "returned") {
            throw new Error("Book already returned");
        }

        const returnDate = new Date();
        let fine = 0;

        if (returnDate > record.dueDate) {
            const daysOverdue = Math.ceil(
                (returnDate.getTime() - record.dueDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            fine = daysOverdue * 5;
        }

        record.returnDate = returnDate;
        record.status = "returned";
        record.fine = fine;
        await record.save();

        await BookModel.findByIdAndUpdate(record.book, {
            $inc: { availableQuantity: 1 },
        });

        await MemberModel.findByIdAndUpdate(record.member, {
            $pull: { borrowedBooks: record.book },
        });

        return record;
    }

    public async findById(id: string): Promise<IBorrowRecordDocument | null> {
        return BorrowRecordModel.findById(id)
            .populate("book", "title author isbn")
            .populate("member", "name email");
    }

    public async findAll(query: BorrowQueryParams) {
        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "desc",
            memberId,
            bookId,
            status,
        } = query;

        const filter: any = {};

        if (memberId) {
            filter.member = memberId;
        }

        if (bookId) {
            filter.book = bookId;
        }

        if (status) {
            filter.status = status;
        }

        const sort: any = {};
        sort[sortBy] = sortOrder === "asc" ? 1 : -1;

        const skip = (page - 1) * limit;

        const [records, total] = await Promise.all([
            BorrowRecordModel.find(filter)
                .populate("book", "title author isbn")
                .populate("member", "name email")
                .sort(sort)
                .skip(skip)
                .limit(limit),
            BorrowRecordModel.countDocuments(filter),
        ]);

        return {
            records,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    public async getOverdueBooks() {
        const now = new Date();
        return BorrowRecordModel.find({
            status: "borrowed",
            dueDate: { $lt: now },
        })
            .populate("book", "title author isbn")
            .populate("member", "name email phone");
    }
}

export default BorrowService;
