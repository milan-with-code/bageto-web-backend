import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { ENV } from "../config/env";
import jwt from "jsonwebtoken";
import { cookieOptions, signAccessToken, verifyToken } from "../lib/auth";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email }).exec();

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);

        if (!isMatchPassword) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = signAccessToken({ id: user._id, email: user.email, });

        res.cookie("token", token, cookieOptions);
        res.status(200).json({
            status: 200,
            message: "Login successful",
            user: { _id: user._id, email: user.email, name: user.name }
        });

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};


export const createUser = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const alreadyUser = await User.findOne({ email }).exec();

        if (alreadyUser) {
            return res.status(409).json({ error: "Email is already registered" });
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: fullName,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            ENV.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                name: newUser.name,
                email: newUser.email,
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}
export const logoutUser = (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
    res.status(200).json({ message: "Logged out successfully" });
};


export const getMe = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.token;
        if (!token) return res.status(401).json({ error: "Not authenticated" });

        const decoded = verifyToken<{ id: string }>(token);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ user: { _id: user._id, email: user.email, name: user.name } });
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};


