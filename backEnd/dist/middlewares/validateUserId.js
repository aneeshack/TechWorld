"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserId = void 0;
const express_validator_1 = require("express-validator");
exports.validateUserId = [
    (0, express_validator_1.param)('userId').isMongoId().withMessage('Invalid userId format')
];
