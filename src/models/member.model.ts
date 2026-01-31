import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IMemberDocument, IMemberModel } from "../interfaces/member.interface";

const memberSchema = new Schema<IMemberDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        membershipType: {
            type: String,
            enum: ["basic", "premium", "student"],
            default: "basic",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        borrowedBooks: [
            {
                type: Schema.Types.ObjectId,
                ref: "Book",
            },
        ],
    },
    {
        timestamps: true,
    }
);

memberSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

memberSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const MemberModel = model<IMemberDocument, IMemberModel>("Member", memberSchema);

export default MemberModel;
