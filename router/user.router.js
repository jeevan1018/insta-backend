import express from "express";
import { User } from "../model/user.model.js";
import { randomBytes, createHmac } from "node:crypto";
import jwt from "jsonwebtoken";
import { ensureAuthenticated } from "../middleware/auth.middleware.js";
const router = express.Router();

router.patch("/profile",ensureAuthenticated, async (req, res) => {
  try {
    const { name } = req.body;
    console.log("User ID from token:", req.user);
   await User.findByIdAndUpdate(req.user.id, { name });

    res.status(200).json({ message: "Profile updated successfully" });
  }catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = randomBytes(256).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      salt,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;   
    const exsistingUser = await User.findOne({ email });

    if (!exsistingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = exsistingUser.salt;
    const hashedPassword = exsistingUser.password;

    const newHash = createHmac("sha256", salt).update(password).digest("hex");

    if (newHash !== hashedPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: exsistingUser._id,
      name: exsistingUser.name,
      email: exsistingUser.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json({
      message: "User logged in successfully",
      token,
    });

  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;