"use strict";
// // authMiddleware.ts
// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import mongoose from "mongoose";
// import { tokenModel } from "../models/tokenModel"; // Adjust path as needed
// import { Role } from "../interfaces/database/IUser";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateStudent = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = __importDefault(require("../config/redis")); // Adjust path to your redis.ts
const IUser_1 = require("../interfaces/database/IUser");
const jwt_1 = require("../util/auth/jwt");
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "default_refresh_secret";
const authenticateStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt;
    console.log("authenticate student");
    if (!token) {
        // No access token, try refreshing from Redis
        yield handleRefreshToken(req, res, next);
        return;
    }
    try {
        // Verify access token from cookie
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Check if role is Student
        if (decoded.role !== IUser_1.Role.Student) {
            res.status(403).json({ success: false, message: "Forbidden: Student access required" });
            return;
        }
        req.user = {
            id: new mongoose_1.default.Types.ObjectId(decoded.id),
            email: decoded.email,
            role: decoded.role,
        };
        console.log("req.user", req.user);
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            // Access token expired, try refreshing from Redis
            yield handleRefreshToken(req, res, next, token);
        }
        else {
            res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
            return;
        }
    }
});
exports.authenticateStudent = authenticateStudent;
const handleRefreshToken = (req, res, next, expiredToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("inside handle refresh");
        // Get userId from expired token (if provided) or fallback to another method if no token
        let userId;
        if (expiredToken) {
            console.log('insided expired token');
            const decodedExpired = jsonwebtoken_1.default.decode(expiredToken);
            if (!decodedExpired || !decodedExpired.id) {
                res.status(401).json({ success: false, message: "Unauthorized: Invalid token payload" });
                return;
            }
            userId = decodedExpired.id;
        }
        else {
            // If no token was provided initially, we can't proceed without some identifier
            res.status(401).json({ success: false, message: "Unauthorized: No token provided to refresh" });
            return;
        }
        // Fetch refresh token from Redis
        const refreshToken = yield redis_1.default.get(`refresh:${userId}`);
        console.log('refreh token in redis', refreshToken);
        if (!refreshToken) {
            res.status(401).json({ success: false, message: "Unauthorized: No refresh token found" });
            return;
        }
        // Verify refresh token
        const decodedRefresh = jsonwebtoken_1.default.verify(refreshToken, REFRESH_SECRET);
        // Check if role is Student
        if (decodedRefresh.role !== IUser_1.Role.Student) {
            res.status(403).json({ success: false, message: "Forbidden: Student access required" });
            return;
        }
        // Generate new access token
        const newToken = jsonwebtoken_1.default.sign({ id: decodedRefresh.id, email: decodedRefresh.email, role: decodedRefresh.role }, JWT_SECRET, { expiresIn: "1h" });
        // Optional: Rotate refresh token
        const newRefreshToken = jsonwebtoken_1.default.sign({ id: decodedRefresh.id, email: decodedRefresh.email, role: decodedRefresh.role }, REFRESH_SECRET, { expiresIn: "7d" });
        yield redis_1.default.setEx(`refresh:${userId}`, 7 * 24 * 60 * 60, newRefreshToken);
        // Set new access token in cookie
        (0, jwt_1.setTokenCookie)(res, newToken);
        // Set user data and proceed
        req.user = {
            id: new mongoose_1.default.Types.ObjectId(decodedRefresh.id),
            email: decodedRefresh.email,
            role: decodedRefresh.role,
        };
        console.log("req.user (refreshed)", req.user);
        next();
    }
    catch (error) {
        console.log('handle refresh error', error);
        res.status(401).json({ success: false, message: "Unauthorized: Session expired, please login again" });
        return;
    }
});
