import { Request, Response } from "express";
import BorrowService from "../services/borrow.service";

class BorrowController {
    private borrowService: BorrowService;

    constructor() {
        this.borrowService = new BorrowService();
    }

    public borrowBook = async (req: Request, res: Response) => {
        try {
            const { bookId, memberId, durationDays } = req.body;

            if (!bookId || !memberId) {
                return res.status(400).json({ message: "Book ID and Member ID required" });
            }

            const record = await this.borrowService.borrowBook({
                bookId,
                memberId,
                durationDays,
            });

            return res.status(201).json(record);
        } catch (err: any) {
            console.error(err);
            return res.status(400).json({ message: err.message || "Failed to borrow book" });
        }
    };

    public returnBook = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const record = await this.borrowService.returnBook(id);

            return res.status(200).json(record);
        } catch (err: any) {
            console.error(err);
            return res.status(400).json({ message: err.message || "Failed to return book" });
        }
    };

    public getBorrowRecord = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const record = await this.borrowService.findById(id);

            if (!record) {
                return res.status(404).json({ message: "Record not found" });
            }

            return res.status(200).json(record);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to get record" });
        }
    };

    public getAllBorrowRecords = async (req: Request, res: Response) => {
        try {
            const { page, limit, sortBy, sortOrder, memberId, bookId, status } = req.query;

            const result = await this.borrowService.findAll({
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined,
                sortBy: sortBy as string,
                sortOrder: sortOrder as "asc" | "desc",
                memberId: memberId as string,
                bookId: bookId as string,
                status: status as "borrowed" | "returned" | "overdue",
            });

            return res.status(200).json(result);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to get records" });
        }
    };

    public getOverdueBooks = async (req: Request, res: Response) => {
        try {
            const records = await this.borrowService.getOverdueBooks();

            return res.status(200).json(records);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to get overdue books" });
        }
    };
}

export default BorrowController;
