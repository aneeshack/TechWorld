"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.envConfig = {
    http: {
        HOST: process.env.HOST,
        PORT: process.env.PORT,
        ORIGIN: process.env.FRONTEND_URL
    },
    mongo: {
        MONGODB_URI: process.env.MONGODB_URI
    },
    stripe: {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
    }
};
