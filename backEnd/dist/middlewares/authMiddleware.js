"use strict";
// import { NextFunction, Request, Response } from "express"
// import jwt from 'jsonwebtoken';
// import mongoose from "mongoose";
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
exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = __importDefault(require("../config/redis"));
const jwt_1 = require("../util/auth/jwt");
// import redisClient from "../../config/redis"; // Adjust path to your redis.ts
// import { setTokenCookie } from "../path-to-your-utils"; // Adjust path to where generateToken, etc., are defined
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "default_refresh_secret";
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt;
    if (!token) {
        res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        return;
    }
    try {
        // Verify access token from cookie
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = {
            id: new mongoose_1.default.Types.ObjectId(decoded.id),
            email: decoded.email,
            role: decoded.role,
        };
        console.log("user", req.user);
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            // Access token expired, attempt to refresh using Redis
            try {
                const decodedExpired = jsonwebtoken_1.default.decode(token);
                if (!decodedExpired || !decodedExpired.id) {
                    res.status(401).json({ success: false, message: "Unauthorized: Invalid token payload" });
                    return;
                }
                const userId = decodedExpired.id;
                const refreshToken = yield redis_1.default.get(`refresh:${userId}`);
                if (!refreshToken) {
                    res.status(401).json({ success: false, message: "Unauthorized: No refresh token found" });
                    return;
                }
                // Verify refresh token from Redis
                const decodedRefresh = jsonwebtoken_1.default.verify(refreshToken, REFRESH_SECRET);
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
                console.log("user (refreshed)", req.user);
                next();
            }
            catch (refreshError) {
                res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired refresh token" });
                return;
            }
        }
        else {
            // Invalid token (not expired, just malformed)
            res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
            return;
        }
    }
});
exports.authenticateUser = authenticateUser;
