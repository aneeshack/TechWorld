"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3Service_1 = __importDefault(require("./s3Service"));
const s3Service = new s3Service_1.default();
exports.default = s3Service;
