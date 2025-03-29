// import { NextFunction, Request, Response } from "express"
// import jwt from 'jsonwebtoken';
// import mongoose from "mongoose";

// const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'

// export interface AuthRequest extends Request{
//     user?: {
//         id: mongoose.Types.ObjectId,
//         email: string,
//         role: string
//     }
// }

// export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction):void =>{
//     const token = req.cookies.jwt;

//     if(!token){
//          res.status(401).json({success:false, message: "Unauthorized: No token provided"})
//          return
//     }

//     try {
//         const decoded = jwt.verify(token, JWT_SECRET) as {id:string, email: string, role:string}

//         req.user = {
//             id:new mongoose.Types.ObjectId(decoded.id),
//             email: decoded.email,
//             role: decoded.role
//         }
//         console.log('user',req.user)
//         next();
//     } catch (error) {
//          res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
//          return
//     }
// }

// src/middlewares/authMiddleware.ts (or wherever this lives)
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import redisClient from "../config/redis";
import { setTokenCookie } from "../util/auth/jwt";
// import redisClient from "../../config/redis"; // Adjust path to your redis.ts
// import { setTokenCookie } from "../path-to-your-utils"; // Adjust path to where generateToken, etc., are defined

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "default_refresh_secret";

export interface AuthRequest extends Request {
  user?: {
    id: mongoose.Types.ObjectId;
    email: string;
    role: string;
  };
}

export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    return;
  }

  try {
    // Verify access token from cookie
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    req.user = {
      id: new mongoose.Types.ObjectId(decoded.id),
      email: decoded.email,
      role: decoded.role,
    };
    console.log("user", req.user);
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // Access token expired, attempt to refresh using Redis
      try {
        const decodedExpired = jwt.decode(token) as { id: string; email: string; role: string } | null;
        if (!decodedExpired || !decodedExpired.id) {
          res.status(401).json({ success: false, message: "Unauthorized: Invalid token payload" });
          return;
        }

        const userId = decodedExpired.id;
        const refreshToken = await redisClient.get(`refresh:${userId}`);
        if (!refreshToken) {
          res.status(401).json({ success: false, message: "Unauthorized: No refresh token found" });
          return;
        }

        // Verify refresh token from Redis
        const decodedRefresh = jwt.verify(refreshToken, REFRESH_SECRET) as {
          id: string;
          email: string;
          role: string;
        };

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
        console.log("user (refreshed)", req.user);
        next();
      } catch (refreshError) {
        res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired refresh token" });
        return;
      }
    } else {
      // Invalid token (not expired, just malformed)
      res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
      return;
    }
  }
};