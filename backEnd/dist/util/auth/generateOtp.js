"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpGenerator = void 0;
class OtpGenerator {
    static generateOtp(length = 6) {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
exports.OtpGenerator = OtpGenerator;
