import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import BorrowController from "../controllers/borrow.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

class BorrowRoutes implements Routes {
    public path = "/borrow";
    public router = Router();
    private borrowController = new BorrowController();
    private authMiddleware = new AuthMiddleware();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}`,
            this.authMiddleware.authenticate,
            this.borrowController.borrowBook
        );
        this.router.patch(
            `${this.path}/:id/return`,
            this.authMiddleware.authenticate,
            this.borrowController.returnBook
        );
        this.router.get(
            `${this.path}`,
            this.authMiddleware.authenticate,
            this.borrowController.getAllBorrowRecords
        );
        this.router.get(
            `${this.path}/overdue`,
            this.authMiddleware.authenticate,
            this.borrowController.getOverdueBooks
        );
        this.router.get(
            `${this.path}/:id`,
            this.authMiddleware.authenticate,
            this.borrowController.getBorrowRecord
        );
    }
}

export default BorrowRoutes;
