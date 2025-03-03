// authMiddleware.ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { tokenModel } from "../models/tokenModel"; // Adjust path as needed
import { Role } from "../interfaces/user/IUser";

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'default_refresh_secret';

export interface AuthRequest extends Request {
    user?: {
        id: mongoose.Types.ObjectId,
        email: string,
        role: string
    }
}

const setTokenCookie = (res: Response, token: string): void => {
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'strict'
    });
};

export const authenticateAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.jwt;
    console.log('authenticate admin')
    if (!token) {
        res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string, role: string };

        if (decoded.role !== Role.Admin) {
            res.status(403).json({ success: false, message: "Forbidden: Instructor access required" });
            return;
        }

        req.user = {
            id: new mongoose.Types.ObjectId(decoded.id),
            email: decoded.email,
            role: decoded.role
        };
        console.log('req.user',req.user)
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            await handleRefreshToken(req, res, next, token);
        } else {
            res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
            return;
        }
    }
};

const handleRefreshToken = async (req: AuthRequest, res: Response, next: NextFunction, expiredToken: string): Promise<void> => {
    try {
        console.log('inside handle refresh')
        const decodedExpired = jwt.decode(expiredToken) as { id: string, email: string, role: string } | null;
        
        if (!decodedExpired || !decodedExpired.id) {
            res.status(401).json({ success: false, message: "Unauthorized: Invalid token payload" });
            return;
        }

        const userId = decodedExpired.id;

        const storedToken = await tokenModel.findOne({ userId });
        if (!storedToken) {
            res.status(401).json({ success: false, message: "Unauthorized: No refresh token found" });
            return;
        }

        const decodedRefresh = jwt.verify(storedToken.token, REFRESH_SECRET) as {
            id: string,
            email: string,
            role: string
        };

        if (decodedRefresh.role !== Role.Admin) {
            res.status(403).json({ success: false, message: "Forbidden: Instructor access required" });
            return;
        }

        // Generate new access token
        const newToken = jwt.sign(
            { id: decodedRefresh.id, email: decodedRefresh.email, role: decodedRefresh.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Optional: Rotate refresh token (comment out if not needed)
        const newRefreshToken = jwt.sign(
            { id: decodedRefresh.id, email: decodedRefresh.email, role: decodedRefresh.role },
            REFRESH_SECRET,
            { expiresIn: '7d' }
        );
        await tokenModel.updateOne(
            { userId: decodedRefresh.id },
            { token: newRefreshToken }
        );

        setTokenCookie(res, newToken);

        req.user = {
            id: new mongoose.Types.ObjectId(decodedRefresh.id),
            email: decodedRefresh.email,
            role: decodedRefresh.role
        };
        next();
    } catch (error) {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        if (error instanceof jwt.TokenExpiredError) {
            const decodedExpired = jwt.decode(expiredToken) as { id: string } | null;
            if (decodedExpired?.id) {
                await tokenModel.deleteOne({ userId: decodedExpired.id });
            }
        }

        res.status(401).json({ success: false, message: "Unauthorized: Session expired, please login again" });
        return;
    }
};