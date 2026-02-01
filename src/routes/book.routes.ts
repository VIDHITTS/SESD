import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import BookController from "../controllers/book.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

class BookRoutes implements Routes {
    public path = "/books";
    public router = Router();
    private bookController = new BookController();
    private authMiddleware = new AuthMiddleware();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.bookController.getAllBooks);
        this.router.get(`${this.path}/:id`, this.bookController.getBook);
        this.router.post(
            `${this.path}`,
            this.authMiddleware.authenticate,
            this.bookController.createBook
        );
        this.router.put(
            `${this.path}/:id`,
            this.authMiddleware.authenticate,
            this.bookController.updateBook
        );
        this.router.delete(
            `${this.path}/:id`,
            this.authMiddleware.authenticate,
            this.bookController.deleteBook
        );
    }
}

export default BookRoutes;
