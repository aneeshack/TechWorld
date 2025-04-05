"use strict";
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
exports.authenticateAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const tokenModel_1 = require("../models/tokenModel"); // Adjust path as needed
const IUser_1 = require("../interfaces/database/IUser");
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'default_refresh_secret';
const setTokenCookie = (res, token) => {
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'strict'
    });
};
const authenticateAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt;
    console.log('authenticate admin');
    if (!token) {
        res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.role !== IUser_1.Role.Admin) {
            res.status(403).json({ success: false, message: "Forbidden: Instructor access required" });
            return;
        }
        req.user = {
            id: new mongoose_1.default.Types.ObjectId(decoded.id),
            email: decoded.email,
            role: decoded.role
        };
        console.log('req.user', req.user);
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            yield handleRefreshToken(req, res, next, token);
        }
        else {
            res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
            return;
        }
    }
});
exports.authenticateAdmin = authenticateAdmin;
const handleRefreshToken = (req, res, next, expiredToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inside handle refresh');
        const decodedExpired = jsonwebtoken_1.default.decode(expiredToken);
        if (!decodedExpired || !decodedExpired.id) {
            res.status(401).json({ success: false, message: "Unauthorized: Invalid token payload" });
            return;
        }
        const userId = decodedExpired.id;
        const storedToken = yield tokenModel_1.tokenModel.findOne({ userId });
        if (!storedToken) {
            res.status(401).json({ success: false, message: "Unauthorized: No refresh token found" });
            return;
        }
        const decodedRefresh = jsonwebtoken_1.default.verify(storedToken.token, REFRESH_SECRET);
        if (decodedRefresh.role !== IUser_1.Role.Admin) {
            res.status(403).json({ success: false, message: "Forbidden: Instructor access required" });
            return;
        }
        // Generate new access token
        const newToken = jsonwebtoken_1.default.sign({ id: decodedRefresh.id, email: decodedRefresh.email, role: decodedRefresh.role }, JWT_SECRET, { expiresIn: '1h' });
        // Optional: Rotate refresh token (comment out if not needed)
        const newRefreshToken = jsonwebtoken_1.default.sign({ id: decodedRefresh.id, email: decodedRefresh.email, role: decodedRefresh.role }, REFRESH_SECRET, { expiresIn: '7d' });
        yield tokenModel_1.tokenModel.updateOne({ userId: decodedRefresh.id }, { token: newRefreshToken });
        setTokenCookie(res, newToken);
        req.user = {
            id: new mongoose_1.default.Types.ObjectId(decodedRefresh.id),
            email: decodedRefresh.email,
            role: decodedRefresh.role
        };
        next();
    }
    catch (error) {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            const decodedExpired = jsonwebtoken_1.default.decode(expiredToken);
            if (decodedExpired === null || decodedExpired === void 0 ? void 0 : decodedExpired.id) {
                yield tokenModel_1.tokenModel.deleteOne({ userId: decodedExpired.id });
            }
        }
        res.status(401).json({ success: false, message: "Unauthorized: Session expired, please login again" });
        return;
    }
});
