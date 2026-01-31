import jwt from "jsonwebtoken";
import MemberModel from "../models/member.model";
import {
    IMemberDocument,
    CreateMemberDTO,
    UpdateMemberDTO,
    LoginDTO,
    MemberQueryParams,
    AuthResponse,
} from "../interfaces/member.interface";

class MemberService {
    private jwtSecret: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || "default_secret";
    }

    private generateToken(member: IMemberDocument): string {
        return jwt.sign(
            { id: member._id, email: member.email },
            this.jwtSecret,
            { expiresIn: "7d" }
        );
    }

    public async register(memberData: CreateMemberDTO): Promise<AuthResponse> {
        const existingMember = await MemberModel.findOne({ email: memberData.email });
        if (existingMember) {
            throw new Error("Email already registered");
        }

        const member = await MemberModel.create(memberData);
        const token = this.generateToken(member);

        return {
            member: {
                name: member.name,
                email: member.email,
                phone: member.phone,
                membershipType: member.membershipType,
            },
            token,
        };
    }

    public async login(loginData: LoginDTO): Promise<AuthResponse> {
        const member = await MemberModel.findOne({ email: loginData.email });
        if (!member) {
            throw new Error("Invalid email or password");
        }

        const isMatch = await member.comparePassword(loginData.password);
        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        if (!member.isActive) {
            throw new Error("Account is deactivated");
        }

        const token = this.generateToken(member);

        return {
            member: {
                name: member.name,
                email: member.email,
                phone: member.phone,
                membershipType: member.membershipType,
            },
            token,
        };
    }

    public async findById(id: string): Promise<IMemberDocument | null> {
        return MemberModel.findById(id).select("-password");
    }

    public async findByEmail(email: string): Promise<IMemberDocument | null> {
        return MemberModel.findOne({ email }).select("-password");
    }

    public async findAll(query: MemberQueryParams) {
        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "desc",
            search,
            membershipType,
            isActive,
        } = query;

        const filter: any = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        if (membershipType) {
            filter.membershipType = membershipType;
        }

        if (isActive !== undefined) {
            filter.isActive = isActive;
        }

        const sort: any = {};
        sort[sortBy] = sortOrder === "asc" ? 1 : -1;

        const skip = (page - 1) * limit;

        const [members, total] = await Promise.all([
            MemberModel.find(filter)
                .select("-password")
                .sort(sort)
                .skip(skip)
                .limit(limit),
            MemberModel.countDocuments(filter),
        ]);

        return {
            members,
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
        updateData: UpdateMemberDTO
    ): Promise<IMemberDocument | null> {
        return MemberModel.findByIdAndUpdate(id, updateData, { new: true }).select(
            "-password"
        );
    }

    public async delete(id: string): Promise<IMemberDocument | null> {
        return MemberModel.findByIdAndDelete(id);
    }

    public async deactivate(id: string): Promise<IMemberDocument | null> {
        return MemberModel.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        ).select("-password");
    }
}

export default MemberService;
