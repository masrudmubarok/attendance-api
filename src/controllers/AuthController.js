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

        const user = await getUserByEmail(email);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "8h" });

        res.status(200).json({ message: "User logged in successfully", token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};

export const logout = (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
};