import { Request, Response } from "express";
import MemberService from "../services/member.service";

class MemberController {
    private memberService: MemberService;

    constructor() {
        this.memberService = new MemberService();
    }

    public register = async (req: Request, res: Response) => {
        try {
            const { name, email, password, phone, address, membershipType } = req.body;

            if (!name || !email || !password || !phone) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            if (password.length < 6) {
                return res
                    .status(400)
                    .json({ message: "Password must be at least 6 characters" });
            }

            const result = await this.memberService.register({
                name,
                email,
                password,
                phone,
                address,
                membershipType,
            });

            return res.status(201).json(result);
        } catch (err: any) {
            console.error(err);
            return res.status(400).json({ message: err.message || "Registration failed" });
        }
    };

    public login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Email and password required" });
            }

            const result = await this.memberService.login({ email, password });

            return res.status(200).json(result);
        } catch (err: any) {
            console.error(err);
            return res.status(401).json({ message: err.message || "Login failed" });
        }
    };

    public getMember = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const member = await this.memberService.findById(id);

            if (!member) {
                return res.status(404).json({ message: "Member not found" });
            }

            return res.status(200).json(member);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to get member" });
        }
    };

    public getAllMembers = async (req: Request, res: Response) => {
        try {
            const { page, limit, sortBy, sortOrder, search, membershipType, isActive } =
                req.query;

            const result = await this.memberService.findAll({
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined,
                sortBy: sortBy as string,
                sortOrder: sortOrder as "asc" | "desc",
                search: search as string,
                membershipType: membershipType as string,
                isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
            });

            return res.status(200).json(result);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to get members" });
        }
    };

    public updateMember = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const member = await this.memberService.update(id, updateData);

            if (!member) {
                return res.status(404).json({ message: "Member not found" });
            }

            return res.status(200).json(member);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to update member" });
        }
    };

    public deleteMember = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const member = await this.memberService.delete(id);

            if (!member) {
                return res.status(404).json({ message: "Member not found" });
            }

            return res.status(200).json({ message: "Member deleted successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to delete member" });
        }
    };

    public deactivateMember = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const member = await this.memberService.deactivate(id);

            if (!member) {
                return res.status(404).json({ message: "Member not found" });
            }

            return res.status(200).json(member);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to deactivate member" });
        }
    };
}

export default MemberController;
