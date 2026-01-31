import BookModel from "../models/book.model";
import {
    IBookDocument,
    CreateBookDTO,
    UpdateBookDTO,
    BookQueryParams,
} from "../interfaces/book.interface";

class BookService {
    public async create(bookData: CreateBookDTO): Promise<IBookDocument> {
        const book = await BookModel.create({
            ...bookData,
            availableQuantity: bookData.quantity,
        });
        return book;
    }

    public async findById(id: string): Promise<IBookDocument | null> {
        return BookModel.findById(id);
    }

    public async findByIsbn(isbn: string): Promise<IBookDocument | null> {
        return BookModel.findOne({ isbn });
    }

    public async findAll(query: BookQueryParams) {
        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "desc",
            search,
            category,
            author,
            available,
        } = query;

        const filter: any = {};

        if (search) {
            filter.$text = { $search: search };
        }

        if (category) {
            filter.category = { $regex: category, $options: "i" };
        }

        if (author) {
            filter.author = { $regex: author, $options: "i" };
        }

        if (available === true) {
            filter.availableQuantity = { $gt: 0 };
        }

        const sort: any = {};
        sort[sortBy] = sortOrder === "asc" ? 1 : -1;

        const skip = (page - 1) * limit;

        const [books, total] = await Promise.all([
            BookModel.find(filter).sort(sort).skip(skip).limit(limit),
            BookModel.countDocuments(filter),
        ]);

        return {
            books,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    public async update(
        id: string,
        updateData: UpdateBookDTO
    ): Promise<IBookDocument | null> {
        return BookModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    public async delete(id: string): Promise<IBookDocument | null> {
        return BookModel.findByIdAndDelete(id);
    }

    public async updateAvailability(
        id: string,
        change: number
    ): Promise<IBookDocument | null> {
        return BookModel.findByIdAndUpdate(
            id,
            { $inc: { availableQuantity: change } },
            { new: true }
        );
    }
}

export default BookService;
