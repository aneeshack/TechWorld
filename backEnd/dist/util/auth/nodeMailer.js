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
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }
    sendMail(email, subject, content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                    throw new Error('Invalid or empty recipient email address.');
                }
                const mailOptions = {
                    from: process.env.SMTP_MAIL,
                    to: email,
                    subject: subject,
                    html: `Your OTP code is ${content}`
                };
                const info = yield this.transporter.sendMail(mailOptions);
                console.log('Email Sent', info.messageId);
            }
            catch (error) {
                console.log('send mail:', error.message);
            }
        });
    }
}
exports.default = EmailService;
