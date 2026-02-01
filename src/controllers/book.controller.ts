import { Request, Response } from "express";
import BookService from "../services/book.service";

class BookController {
    private bookService: BookService;

    constructor() {
        this.bookService = new BookService();
    }

    public createBook = async (req: Request, res: Response) => {
        try {
            const { title, author, isbn, category, publishedYear, quantity, description } =
                req.body;

            if (!title || !author || !isbn || !category || !publishedYear || !quantity) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const existingBook = await this.bookService.findByIsbn(isbn);
            if (existingBook) {
                return res.status(400).json({ message: "ISBN already exists" });
            }

            const book = await this.bookService.create({
                title,
                author,
                isbn,
                category,
                publishedYear,
                quantity,
                description,
            });

            return res.status(201).json(book);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to create book" });
        }
    };

    public getBook = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const book = await this.bookService.findById(id);

            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }

            return res.status(200).json(book);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to get book" });
        }
    };

    public getAllBooks = async (req: Request, res: Response) => {
        try {
            const {
                page,
                limit,
                sortBy,
                sortOrder,
                search,
                category,
                author,
                available,
            } = req.query;

            const result = await this.bookService.findAll({
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined,
                sortBy: sortBy as string,
                sortOrder: sortOrder as "asc" | "desc",
                search: search as string,
                category: category as string,
                author: author as string,
                available: available === "true",
            });

            return res.status(200).json(result);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to get books" });
        }
    };

    public updateBook = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const book = await this.bookService.update(id, updateData);

            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }

            return res.status(200).json(book);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to update book" });
        }
    };

    public deleteBook = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const book = await this.bookService.delete(id);

            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }

            return res.status(200).json({ message: "Book deleted successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to delete book" });
        }
    };
}

export default BookController;
