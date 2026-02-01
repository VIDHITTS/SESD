import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import MemberController from "../controllers/member.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

class MemberRoutes implements Routes {
    public path = "/members";
    public router = Router();
    private memberController = new MemberController();
    private authMiddleware = new AuthMiddleware();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, this.memberController.register);
        this.router.post(`${this.path}/login`, this.memberController.login);
        this.router.get(
            `${this.path}`,
            this.authMiddleware.authenticate,
            this.memberController.getAllMembers
        );
        this.router.get(
            `${this.path}/:id`,
            this.authMiddleware.authenticate,
            this.memberController.getMember
        );
        this.router.put(
            `${this.path}/:id`,
            this.authMiddleware.authenticate,
            this.memberController.updateMember
        );
        this.router.delete(
            `${this.path}/:id`,
            this.authMiddleware.authenticate,
            this.memberController.deleteMember
        );
        this.router.patch(
            `${this.path}/:id/deactivate`,
            this.authMiddleware.authenticate,
            this.memberController.deactivateMember
        );
    }
}

export default MemberRoutes;
