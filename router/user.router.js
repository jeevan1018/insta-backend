import express from "express";
import { User } from "../schema/user.schema.js";
import { randomBytes, createHmac } from "node:crypto";
import jwt from "jsonwebtoken";
import { ensureAuthenticated } from "../middleware/auth.middleware.js";
import {
  validateRegisterRequest,
  validateLoginRequest,
} from "../utils/validation.js";
import { sendSuccess, sendError, sendValidationError } from "../utils/responses.js";

const router = express.Router();

/**
 * PATCH /user/profile
 * Update user profile (requires authentication)
 */
router.patch("/profile", ensureAuthenticated, async (req, res) => {
  try {
    const { name } = req.body;
    console.log("User ID from token:", req.user);
    await User.findByIdAndUpdate(req.user.id, { name });

    return sendSuccess(res, { message: "Profile updated successfully" }, 200);
  } catch (error) {
    console.error("Error updating profile:", error);
    return sendError(res, "Internal server error", 500);
  }
});

/**
 * POST /user/register
 * Register a new user
 * 
 * Request Body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "Password@123",
 *   "confirmPassword": "Password@123"
 * }
 * 
 * Response (201 Created):
 * {
 *   "success": true,
 *   "message": "User registered successfully",
 *   "data": {
 *     "id": "user_id",
 *     "name": "John Doe",
 *     "email": "john@example.com"
 *   },
 *   "timestamp": "2024-01-01T12:00:00.000Z"
 * }
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate request payload
    const validation = validateRegisterRequest(
      name,
      email,
      password,
      confirmPassword
    );

    if (!validation.isValid) {
      return sendValidationError(res, validation.errors);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return sendError(
        res,
        "Email already registered",
        409,
        { email: "This email is already in use" }
      );
    }

    // Hash password with salt
    const salt = randomBytes(32).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      salt,
    });

    return sendSuccess(
      res,
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      201,
      "User registered successfully"
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return sendError(res, "Internal server error", 500);
  }
});

/**
 * POST /user/login
 * Authenticate user and return JWT token
 * 
 * Request Body:
 * {
 *   "email": "john@example.com",
 *   "password": "Password@123"
 * }
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "User logged in successfully",
 *   "data": {
 *     "token": "eyJhbGc...",
 *     "user": {
 *       "id": "user_id",
 *       "name": "John Doe",
 *       "email": "john@example.com"
 *     },
 *     "expiresIn": "24h"
 *   },
 *   "timestamp": "2024-01-01T12:00:00.000Z"
 * }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request payload
    const validation = validateLoginRequest(email, password);

    if (!validation.isValid) {
      return sendValidationError(res, validation.errors);
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return sendError(res, "Invalid email or password", 401);
    }

    // Verify password
    const hashedPassword = createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== user.password) {
      return sendError(res, "Invalid email or password", 401);
    }

    // Generate JWT token
    const tokenPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });

    return sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        expiresIn: "24h",
      },
      200,
      "User logged in successfully"
    );
  } catch (error) {
    console.error("Error logging in user:", error);
    return sendError(res, "Internal server error", 500);
  }
});

export default router;