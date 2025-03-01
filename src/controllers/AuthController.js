import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "../models/UserModel.js";

export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await getUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(email, hashedPassword, name);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validasi input
        if (!email || !password) {
            return res.status(400).json({ message: "Email & password are required" });
        }

        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: process.env.JWT_EPXPIRES_IN || "8h" }
        );

        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: { id: user.id, email: user.email, name: user.name }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

export const logout = (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
};