import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import redisClient from "../config/redis"; // Adjust path to your redis.ts
import { Role } from "../interfaces/database/IUser";
import { setTokenCookie } from "../util/auth/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "default_refresh_secret";

export interface AuthRequest extends Request {
  user?: {
    id: mongoose.Types.ObjectId;
    email: string;
    role: string;
  };
}


export const authenticateStudent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.jwt;
  console.log("authenticate student");

  if (!token) {
    // No access token, try refreshing from Redis
    await handleRefreshToken(req, res, next);
    return;
  }

  try {
    // Verify access token from cookie
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    
    // Check if role is Student
    if (decoded.role !== Role.Student) {
      res.status(403).json({ success: false, message: "Forbidden: Student access required" });
      return;
    }

    req.user = {
      id: new mongoose.Types.ObjectId(decoded.id),
      email: decoded.email,
      role: decoded.role,
    };
    console.log("req.user", req.user);
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // Access token expired, try refreshing from Redis
      await handleRefreshToken(req, res, next, token);
    } else {
      res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
      return;
    }
  }
};

const handleRefreshToken = async (req: AuthRequest, res: Response, next: NextFunction, expiredToken?: string): Promise<void> => {
  try {
    console.log("inside handle refresh");

    // Get userId from expired token (if provided) or fallback to another method if no token
    let userId: string;
    if (expiredToken) {
      console.log('insided expired token')
      const decodedExpired = jwt.decode(expiredToken) as { id: string; email: string; role: string } | null;
      if (!decodedExpired || !decodedExpired.id) {
        res.status(401).json({ success: false, message: "Unauthorized: Invalid token payload" });
        return;
      }
      userId = decodedExpired.id;
    } else {
      // If no token was provided initially, we can't proceed without some identifier
      res.status(401).json({ success: false, message: "Unauthorized: No token provided to refresh" });
      return;
    }

    // Fetch refresh token from Redis
    const refreshToken = await redisClient.get(`refresh:${userId}`);
    console.log('refreh token in redis', refreshToken)
    if (!refreshToken) {
      res.status(401).json({ success: false, message: "Unauthorized: No refresh token found" });
      return;
    }

    // Verify refresh token
    const decodedRefresh = jwt.verify(refreshToken, REFRESH_SECRET) as {
      id: string;
      email: string;
      role: string;
    };

    // Check if role is Student
    if (decodedRefresh.role !== Role.Student) {
      res.status(403).json({ success: false, message: "Forbidden: Student access required" });
      return;
    }

    // Generate new access token
    const newToken = jwt.sign(
      { id: decodedRefresh.id, email: decodedRefresh.email, role: decodedRefresh.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Optional: Rotate refresh token
    const newRefreshToken = jwt.sign(
      { id: decodedRefresh.id, email: decodedRefresh.email, role: decodedRefresh.role },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    await redisClient.setEx(`refresh:${userId}`, 7 * 24 * 60 * 60, newRefreshToken);

    // Set new access token in cookie
    setTokenCookie(res, newToken);

    // Set user data and proceed
    req.user = {
      id: new mongoose.Types.ObjectId(decodedRefresh.id),
      email: decodedRefresh.email,
      role: decodedRefresh.role,
    };
    console.log("req.user (refreshed)", req.user);
    next();
  } catch (error) {
    console.log('handle refresh error',error)

    res.status(401).json({ success: false, message: "Unauthorized: Session expired, please login again" });
    return;
  }
};