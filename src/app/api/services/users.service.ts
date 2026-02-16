import { ROLES } from "../lib/constants/enums";
import User from "../models/user";
import bcrypt from "bcryptjs";

interface UpdateUserProps {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: string;
    status?: string;
    departmentId?: string;
    salary?: number;
    skillSet?: string[];
    dob?: Date;
    joiningDate?: Date;
}

// Get user by ID
export const getUserById = async (id: string) => {
    const user = await User.findById(id)
        .populate("departmentId", "name")
        .populate("companyId", "companyName email");
    if (!user) throw new Error("User not found");
    return user;
};

// Get all users with role filter & pagination
export const getAllUsers = async ({
    companyId,
    role,
    page = 1,
    limit = 10,
}: {
    companyId: string;
    role?: string;
    page?: number;
    limit?: number;
}) => {
    const query: any = { companyId };
    if (role) query.role = ROLES;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find(query)
            .skip(skip)
            .limit(limit)
            .populate("departmentId", "name")
            .populate("companyId", "companyName email"),
        User.countDocuments(query),
    ]);

    return {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};

// Update user
export const updateUser = async (id: string, data: UpdateUserProps) => {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");

    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }

    Object.assign(user, data);
    await user.save();
    return user;
};

// Delete user
export const deleteUser = async (id: string) => {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");

    await user.deleteOne();
    return { message: "User deleted successfully" };
};
