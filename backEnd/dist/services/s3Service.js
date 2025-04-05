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
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
class S3Service {
    constructor() {
        this._s3Client = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            },
        });
    }
    generatePresignedUrl(key_1) {
        return __awaiter(this, arguments, void 0, function* (key, expiresIn = 300) {
            try {
                const params = {
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: key,
                    Expires: expiresIn,
                };
                const command = new client_s3_1.GetObjectCommand(params);
                const presignedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(this._s3Client, command, { expiresIn });
                return presignedUrl;
            }
            catch (error) {
                console.error("S3Service error: generating presigned URL", error);
                throw new Error(`Failed to generate presigned URL: ${error.message}`);
            }
        });
    }
    // New method for uploading (PutObjectCommand)
    generatePresignedUrlForUpload(key_1, fileType_1) {
        return __awaiter(this, arguments, void 0, function* (key, fileType, expiresIn = 60) {
            try {
                const params = {
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: key,
                    ContentType: fileType,
                };
                const command = new client_s3_1.PutObjectCommand(params);
                const presignedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(this._s3Client, command, { expiresIn });
                const videoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
                return { presignedUrl, videoUrl };
            }
            catch (error) {
                console.error("S3Service error: generating presigned URL for upload", error);
                throw new Error(`Failed to generate presigned URL for upload: ${error.message}`);
            }
        });
    }
}
exports.default = S3Service;
